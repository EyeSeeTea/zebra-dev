import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DataStoreClient } from "../DataStoreClient";
import { Future } from "../../domain/entities/generic/Future";
import {
    AlertSyncOptions,
    AlertSyncRepository,
} from "../../domain/repositories/AlertSyncRepository";
import { FutureData } from "../api-futures";
import { getOutbreakKey, getAlertValueFromMap } from "./utils/AlertOutbreakMapper";
import { Maybe } from "../../utils/ts-utils";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import { OptionsD2Repository } from "./OptionsD2Repository";
import { AlertEvent, AlertSynchronizationData } from "../../domain/entities/alert/AlertData";
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export class AlertSyncDataStoreRepository implements AlertSyncRepository {
    private dataStoreClient: DataStoreClient;
    private optionsRepository: OptionsD2Repository;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
        this.optionsRepository = new OptionsD2Repository(api);
    }

    saveAlertSyncData(options: AlertSyncOptions): FutureData<void> {
        const { alert: alertData, dataSource, hazardTypeCode, suspectedDiseaseCode } = options;
        const verificationStatus = getAlertValueFromMap("verificationStatus", alertData);

        if (verificationStatus === "VERIFIED") {
            return Future.joinObj({
                hazardTypes: this.optionsRepository.getHazardTypes(),
                suspectedDiseases: this.optionsRepository.getSuspectedDiseases(),
            }).flatMap(({ hazardTypes, suspectedDiseases }) => {
                const outbreakKey = getOutbreakKey(
                    dataSource,
                    suspectedDiseaseCode ?? hazardTypeCode,
                    suspectedDiseases,
                    hazardTypes
                );
                if (!outbreakKey) return Future.success(undefined);

                const synchronizationData = this.buildSynchronizationData(options, outbreakKey);

                return this.getAlertObject(outbreakKey).flatMap(outbreakData => {
                    const syncData: AlertSynchronizationData = !outbreakData
                        ? synchronizationData
                        : {
                              ...outbreakData,
                              lastSyncTime: new Date().toISOString(),
                              alerts: [...outbreakData.alerts, ...synchronizationData.alerts],
                          };

                    return this.saveAlertObject(outbreakKey, syncData);
                });
            });
        }

        return Future.success(undefined);
    }

    private getAlertObject(outbreakKey: string): FutureData<Maybe<AlertSynchronizationData>> {
        return this.dataStoreClient.getObject<AlertSynchronizationData>(outbreakKey);
    }

    private saveAlertObject(
        outbreakKey: string,
        syncData: AlertSynchronizationData
    ): FutureData<void> {
        return this.dataStoreClient.saveObject<AlertSynchronizationData>(outbreakKey, syncData);
    }

    private buildSynchronizationData(
        options: AlertSyncOptions,
        outbreakKey: string
    ): AlertSynchronizationData {
        const { alert: alertData, nationalDiseaseOutbreakEventId, dataSource } = options;
        const outbreakType =
            dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS ? "disease" : "hazard";

        const alerts: AlertEvent[] =
            alertData.enrollments?.flatMap(enrollment =>
                enrollment.events?.map(event => {
                    const dataValues = event.dataValues;

                    return {
                        type: outbreakType,
                        alertId: event.event,
                        eventDate: event.createdAt,
                        orgUnit: alertData.orgUnit,
                        suspectedCases: getDataValueFromMap("Suspected Cases", dataValues),
                        probableCases: getDataValueFromMap("Probable Cases", dataValues),
                        confirmedCases: getDataValueFromMap("Confirmed Cases", dataValues),
                        deaths: getDataValueFromMap("Deaths", dataValues),
                    };
                })
            ) ?? [];

        return {
            lastSyncTime: new Date().toISOString(),
            type: outbreakType,
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
