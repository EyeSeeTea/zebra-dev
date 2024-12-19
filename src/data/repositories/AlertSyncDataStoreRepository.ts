import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DataStoreClient } from "../DataStoreClient";
import { Future } from "../../domain/entities/generic/Future";
import {
    AlertSyncOptions,
    AlertSyncRepository,
} from "../../domain/repositories/AlertSyncRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { getAlertValueFromMap } from "./utils/AlertOutbreakMapper";
import { Maybe } from "../../utils/ts-utils";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    AlertsAndCaseForCasesData,
    getOutbreakKey,
} from "../../domain/entities/AlertsAndCaseForCasesData";
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { RTSL_ZEBRA_ALERTS_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import { assertOrError } from "./utils/AssertOrError";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Alert, VerificationStatus } from "../../domain/entities/alert/Alert";

export class AlertSyncDataStoreRepository implements AlertSyncRepository {
    private dataStoreClient: DataStoreClient;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
    }

    saveAlertSyncData(options: AlertSyncOptions): FutureData<void> {
        const {
            alert,
            dataSource,
            hazardTypeCode,
            suspectedDiseaseCode,
            hazardTypes,
            suspectedDiseases,
        } = options;

        return this.getAlertTrackedEntity(alert).flatMap(alertTrackedEntity => {
            const verificationStatus = getAlertValueFromMap(
                "verificationStatus",
                alertTrackedEntity
            );

            if (verificationStatus === VerificationStatus.RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED) {
                const outbreakKey = getOutbreakKey({
                    dataSource: dataSource,
                    outbreakValue: suspectedDiseaseCode || hazardTypeCode,
                    hazardTypes: hazardTypes,
                    suspectedDiseases: suspectedDiseases,
                });

                if (!outbreakKey) return Future.error(new Error(`No outbreak key found`));

                const synchronizationData = this.buildSynchronizationData(
                    options,
                    alertTrackedEntity,
                    outbreakKey
                );

                return this.getAlertObject(outbreakKey).flatMap(outbreakData => {
                    const syncData: AlertsAndCaseForCasesData = !outbreakData
                        ? synchronizationData
                        : {
                              ...outbreakData,
                              lastSyncTime: new Date().toISOString(),
                              lastUpdated: new Date().toISOString(),
                              alerts: [
                                  ...(outbreakData.alerts || []),
                                  ...(synchronizationData.alerts || []),
                              ],
                          };

                    return this.saveAlertObject(outbreakKey, syncData);
                });
            }

            return Future.success(undefined);
        });
    }

    public getAlertTrackedEntity(alert: Alert): FutureData<D2TrackerTrackedEntity> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                orgUnit: alert.district,
                trackedEntity: alert.id,
                ouMode: "SELECTED",
                fields: {
                    trackedEntity: true,
                    attributes: true,
                    enrollments: true,
                },
            })
        ).flatMap(response => assertOrError(response.instances[0], "Tracked entity"));
    }

    private getAlertObject(outbreakKey: string): FutureData<Maybe<AlertsAndCaseForCasesData>> {
        return this.dataStoreClient.getObject<AlertsAndCaseForCasesData>(outbreakKey);
    }

    private saveAlertObject(
        outbreakKey: string,
        syncData: AlertsAndCaseForCasesData
    ): FutureData<void> {
        return this.dataStoreClient.saveObject<AlertsAndCaseForCasesData>(outbreakKey, syncData);
    }

    private buildSynchronizationData(
        options: AlertSyncOptions,
        trackedEntity: D2TrackerTrackedEntity,
        outbreakKey: string
    ): AlertsAndCaseForCasesData {
        const { alert, nationalDiseaseOutbreakEventId, dataSource } = options;
        const outbreakType =
            dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS ? "disease" : "hazard";

        const alerts =
            trackedEntity.enrollments?.flatMap(enrollment =>
                enrollment.events?.map(event => {
                    const dataValues = event.dataValues;

                    return {
                        type: outbreakType,
                        alertId: event.event,
                        eventDate: event.createdAt,
                        orgUnit: alert.district,
                        suspectedCases: getDataValueFromMap("Suspected Cases", dataValues),
                        probableCases: getDataValueFromMap("Probable Cases", dataValues),
                        confirmedCases: getDataValueFromMap("Confirmed Cases", dataValues),
                        deaths: getDataValueFromMap("Deaths", dataValues),
                    };
                })
            ) ?? [];

        return {
            lastSyncTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            nationalDiseaseOutbreakEventId: nationalDiseaseOutbreakEventId,
            [outbreakType]: outbreakKey,
            alerts: alerts,
        };
    }
}

function getDataValueFromMap(
    key: keyof typeof dataElementIds,
    dataValues: Maybe<DataValue[]>
): string {
    if (!dataValues) return "";

    return dataValues.find(dataValue => dataValue.dataElement === dataElementIds[key])?.value ?? "";
}

const dataElementIds = {
    "Suspected Cases": "d4B5pN7ZTEu",
    "Probable Cases": "bUMlIfyJEYK",
    "Confirmed Cases": "ApKJDLI5nHP",
    Deaths: "Sfl82Bx0ZNz",
} as const;
