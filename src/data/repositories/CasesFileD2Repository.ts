import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DataStoreClient } from "../DataStoreClient";
import { apiToFuture, FutureData } from "../api-futures";
import { CasesFileRepository } from "../../domain/repositories/CasesFileRepository";
import { AlertsAndCaseForCasesData } from "../../domain/entities/AlertsAndCaseForCasesData";
import { Maybe } from "../../utils/ts-utils";
import { Id } from "../../domain/entities/Ref";
import { Future } from "../../domain/entities/generic/Future";
import { CaseFile } from "../../domain/entities/CasesFile";
import { AppDatastoreConfig } from "../../domain/entities/AppDatastoreConfig";

export class CasesFileD2Repository implements CasesFileRepository {
    constructor(private api: D2Api, private dataStoreClient: DataStoreClient) {}

    get(outbreakKey: Id): FutureData<CaseFile> {
        return this.getAlertsAndCaseForCasesDataObject(outbreakKey).flatMap(
            alertsAndCaseForCasesData => {
                if (
                    !alertsAndCaseForCasesData?.case?.fileId ||
                    !alertsAndCaseForCasesData?.case?.fileName ||
                    !alertsAndCaseForCasesData?.case?.fileType
                )
                    return Future.error(new Error("No cases file id found"));

                return this.downloadCasesFile(
                    alertsAndCaseForCasesData.case.fileId,
                    alertsAndCaseForCasesData.case.fileName,
                    alertsAndCaseForCasesData.case.fileType
                );
            }
        );
    }

    getTemplate(): FutureData<CaseFile> {
        return this.dataStoreClient
            .getObject<AppDatastoreConfig>("app-config")
            .flatMap(appConfig => {
                if (
                    !appConfig?.casesFileTemplate?.fileId ||
                    !appConfig?.casesFileTemplate?.fileName
                )
                    return Future.error(new Error("No cases file template found"));

                const { casesFileTemplate } = appConfig;
                return this.downloadCasesFile(
                    casesFileTemplate.fileId,
                    casesFileTemplate.fileName,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
            });
    }

    save(diseaseOutbreakEventId: Id, outbreakKey: string, caseFile: CaseFile): FutureData<void> {
        return Future.joinObj({
            fileId: this.uploadCasesFile(caseFile.file),
            alertsAndCaseForCasesData: this.getAlertsAndCaseForCasesDataObject(outbreakKey),
        }).flatMap(({ fileId, alertsAndCaseForCasesData }) => {
            const newAlertsAndCaseForCasesData: AlertsAndCaseForCasesData = {
                ...(alertsAndCaseForCasesData || {}),
                lastUpdated: new Date().toISOString(),
                nationalDiseaseOutbreakEventId: diseaseOutbreakEventId,
                case: {
                    fileId,
                    fileName: caseFile.file.name,
                    fileType: caseFile.file.type,
                },
            };
            return this.saveAlertsAndCaseForCasesDataObject(
                outbreakKey,
                newAlertsAndCaseForCasesData
            ).flatMap(() => Future.success(undefined));
        });
    }

    delete(outbreakKey: Id): FutureData<void> {
        return this.getAlertsAndCaseForCasesDataObject(outbreakKey).flatMap(
            alertsAndCaseForCasesData => {
                if (!alertsAndCaseForCasesData?.case?.fileId)
                    return Future.error(new Error("No cases file id found"));

                return this.deleteCasesFile(alertsAndCaseForCasesData.case.fileId).flatMap(() => {
                    return this.saveAlertsAndCaseForCasesDataObject(outbreakKey, {
                        ...alertsAndCaseForCasesData,
                        lastUpdated: new Date().toISOString(),
                        case: undefined,
                    });
                });
            }
        );
    }

    private downloadCasesFile(
        fileId: Id,
        fileName: string,
        fileType: string
    ): FutureData<CaseFile> {
        return apiToFuture(this.api.files.get(fileId))
            .map(blob => {
                return new File([blob], fileName, { type: fileType });
            })
            .flatMap(file => {
                return Future.success({
                    fileId,
                    file,
                });
            });
    }

    private uploadCasesFile(file: File): FutureData<Id> {
        return apiToFuture(
            this.api.files.upload({
                name: file.name,
                data: file,
            })
        ).map(response => response.id);
    }

    private deleteCasesFile(fileId: Id): FutureData<void> {
        return apiToFuture(this.api.files.delete(fileId)).flatMap(response => {
            if (response.httpStatus === "OK") return Future.success(undefined);
            else return Future.error(new Error("Error while deleting cases file"));
        });
    }

    private getAlertsAndCaseForCasesDataObject(
        outbreakKey: string
    ): FutureData<Maybe<AlertsAndCaseForCasesData>> {
        return this.dataStoreClient.getObject<AlertsAndCaseForCasesData>(outbreakKey);
    }

    private saveAlertsAndCaseForCasesDataObject(
        outbreakKey: string,
        alertsAndCaseForCasesData: AlertsAndCaseForCasesData
    ): FutureData<void> {
        return this.dataStoreClient.saveObject<AlertsAndCaseForCasesData>(
            outbreakKey,
            alertsAndCaseForCasesData
        );
    }
}
