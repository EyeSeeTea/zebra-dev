import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DataStoreClient } from "../DataStoreClient";
import { Future } from "../../domain/entities/generic/Future";
import {
    AlertSyncOptions,
    AlertSyncRepository,
} from "../../domain/repositories/AlertSyncRepository";
import { FutureData } from "../api-futures";
import { getOutbreakKey, getValueFromMap } from "./utils/AlertOutbreakMapper";
import { Maybe } from "../../utils/ts-utils";
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import { OptionsD2Repository } from "./OptionsD2Repository";
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    Alert,
    AlertSynchronizationData,
    OutbreakType,
} from "../../domain/entities/alert-data/AlertData";

export type AlertData = {
    alert: D2TrackerTrackedEntity;
    attribute: Maybe<Attribute>;
    dataSource: DataSource;
};

export class AlertSyncDataStoreRepository implements AlertSyncRepository {
    private dataStoreClient: DataStoreClient;
    private optionsRepository: OptionsD2Repository;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
        this.optionsRepository = new OptionsD2Repository(api);
    }

    saveAlertSyncData(options: AlertSyncOptions): FutureData<void> {
        const { alertData, eventId, dataSource, hazardTypeCode, suspectedDiseaseCode } = options;

        const verificationStatus = getValueFromMap("verificationStatus", alertData);
        const outbreakType: OutbreakType = dataSource === "IBS" ? "disease" : "hazard";

        if (verificationStatus === "VERIFIED") {
            const alerts: Alert[] =
                alertData.enrollments?.flatMap(enrollment =>
                    enrollment.events?.map(event => {
                        const dataValues = event.dataValues;

                        return {
                            type: outbreakType,
                            alertId: event.event,
                            eventDate: event.createdAt,
                            orgUnit: alertData.orgUnit,
                            "Suspected Cases": getDataValueFromMap("Suspected Cases", dataValues),
                            "Probable Cases": getDataValueFromMap("Probable Cases", dataValues),
                            "Confirmed Cases": getDataValueFromMap("Confirmed Cases", dataValues),
                            Deaths: getDataValueFromMap("Deaths", dataValues),
                        };
                    })
                ) ?? [];

            return Future.joinObj({
                hazardTypes: this.optionsRepository.getAllHazardTypes(),
                suspectedDiseases: this.optionsRepository.getAllSuspectedDiseases(),
            }).flatMap(({ hazardTypes, suspectedDiseases }) => {
                const outbreakKey = getOutbreakKey(
                    dataSource,
                    suspectedDiseaseCode ?? hazardTypeCode,
                    suspectedDiseases,
                    hazardTypes
                );

                if (!outbreakKey) return Future.success(undefined);

                const synchronizationData: AlertSynchronizationData = {
                    lastSyncTime: new Date().toISOString(),
                    type: outbreakType,
                    nationalTrackedEntityEventId: eventId,
                    [outbreakType]: outbreakKey,
                    alerts: alerts,
                };

                return this.getAlertObject(outbreakKey).flatMap(outbreakData => {
                    const syncData: AlertSynchronizationData = !outbreakData
                        ? synchronizationData
                        : {
                              ...outbreakData,
                              lastSyncTime: new Date().toISOString(),
                              alerts: [...outbreakData.alerts, ...alerts],
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
