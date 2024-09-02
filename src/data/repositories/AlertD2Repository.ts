import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { AlertOptions, AlertRepository } from "../../domain/repositories/AlertRepository";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    Attribute,
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import {
    DataSource,
    OutbreakType,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DataStoreClient } from "../DataStoreClient";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import { OptionsD2Repository } from "./OptionsD2Repository";
import { getOutbreakFromOptions, getValueFromMap } from "./utils/AlertOutbreakMapper";

type Filter = {
    id: Id;
    value: Maybe<string>;
};

type Alert = {
    alertId: string;
    eventDate: Maybe<string>;
    orgUnit: Maybe<string>;
    "Suspected Cases": string;
    "Probable Cases": string;
    "Confirmed Cases": string;
    Deaths: string;
};

type AlertSynchronizationData = {
    lastSyncTime: string;
    type: string;
    nationalTrackedEntityEventId: Id;
    alerts: Alert[];
} & {
    [key in OutbreakType]?: string;
};

export class AlertD2Repository implements AlertRepository {
    private dataStoreClient: DataStoreClient;
    private optionsRepository: OptionsD2Repository;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
        this.optionsRepository = new OptionsD2Repository(api);
    }

    updateAlerts(alertOptions: AlertOptions): FutureData<void> {
        const { dataSource, eventId, hazardTypeCode, incidentStatus, suspectedDiseaseCode } =
            alertOptions;
        const filter = this.getAlertFilter(dataSource, suspectedDiseaseCode, hazardTypeCode);

        return Future.joinObj({
            alertTrackedEntities: this.getTrackedEntitiesByTEACode({
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                ouMode: "DESCENDANTS",
                filter: filter,
            }),
            hazardTypes: this.optionsRepository.getAllHazardTypes(),
            suspectedDiseases: this.optionsRepository.getAllSuspectedDiseases(),
        }).flatMap(({ alertTrackedEntities, hazardTypes, suspectedDiseases }) => {
            const alertsToMap = alertTrackedEntities.map(trackedEntity => ({
                trackedEntity: trackedEntity.trackedEntity,
                trackedEntityType: trackedEntity.trackedEntityType,
                orgUnit: trackedEntity.orgUnit,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                        value: eventId,
                    },
                    {
                        attribute: RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
                        value: incidentStatus,
                    },
                ],
            }));

            if (alertsToMap.length === 0) return Future.success(undefined);

            // alertsToMap.forEach(alertTrackedEntity => {
            //     const outbreakType = dataSource === "IBS" ? "disease" : "hazard";
            //     const outbreakKey = getOutbreakFromOptions(
            //         { value: filter.value, type: outbreakType },
            //         suspectedDiseases,
            //         hazardTypes
            //     );

            //     if (!outbreakKey) return Future.success(undefined);

            //     return this.saveAlertData({
            //         nationalTrackedEntityEventId: eventId,
            //         outbreakKey: outbreakKey,
            //         outbreakType: outbreakType,
            //         trackedEntity: alertTrackedEntity,
            //     }).run(
            //         () =>
            //             console.debug(
            //                 `Successfully saved alert data for ${outbreakKey} ${outbreakType}`
            //             ),
            //         error => {
            //             console.error(error);
            //             console.error(
            //                 `Error saving alert data for ${outbreakKey} ${outbreakType}`
            //             );
            //         }
            //     );
            // });

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: alertsToMap }
                )
            ).flatMap(saveResponse => {
                if (saveResponse.status === "ERROR")
                    return Future.error(
                        new Error("Error mapping disease outbreak event id to alert")
                    );
                else return Future.success(undefined);
            });
        });
    }

    private async getTrackedEntitiesByTEACodeAsync(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter?: Filter;
    }): Promise<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode, filter } = options;
        const d2TrackerTrackedEntities: D2TrackerTrackedEntity[] = [];

        const pageSize = 250;
        let page = 1;
        let result: TrackedEntitiesGetResponse;

        try {
            do {
                result = await this.api.tracker.trackedEntities
                    .get({
                        program: program,
                        orgUnit: orgUnit,
                        ouMode: ouMode,
                        totalPages: true,
                        page: page,
                        pageSize: pageSize,
                        fields: {
                            attributes: true,
                            orgUnit: true,
                            trackedEntity: true,
                            trackedEntityType: true,
                            enrollments: {
                                events: {
                                    createdAt: true,
                                    dataValues: {
                                        dataElement: true,
                                        value: true,
                                    },
                                    event: true,
                                },
                            },
                        },
                        filter: filter ? `${filter.id}:eq:${filter.value}` : undefined,
                    })
                    .getData();

                d2TrackerTrackedEntities.push(...result.instances);

                page++;
            } while (result.page < Math.ceil((result.total as number) / pageSize));
            return d2TrackerTrackedEntities;
        } catch {
            return [];
        }
    }

    getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter?: Filter;
    }): FutureData<D2TrackerTrackedEntity[]> {
        return Future.fromPromise(this.getTrackedEntitiesByTEACodeAsync(options));
    }

    private getAlertFilter(
        dataSource: DataSource,
        suspectedDiseaseCode: Maybe<string>,
        hazardTypeCode: Maybe<string>
    ): Filter {
        switch (dataSource) {
            case "IBS":
                return { id: RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID, value: suspectedDiseaseCode };
            case "EBS":
                return { id: RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID, value: hazardTypeCode };
        }
    }

    getTEAttributeById(trackedEntity: D2TrackerTrackedEntity, attributeId: Id): Maybe<Attribute> {
        if (!trackedEntity.attributes) return undefined;

        return trackedEntity.attributes
            .map(attribute => ({ attribute: attribute.attribute, value: attribute.value }))
            .find(attribute => attribute.attribute === attributeId);
    }

    saveAlertData(options: {
        nationalTrackedEntityEventId: Id;
        outbreakKey: string;
        outbreakType: OutbreakType;
        trackedEntity: D2TrackerTrackedEntity;
    }): FutureData<void> {
        const { nationalTrackedEntityEventId, outbreakKey, outbreakType, trackedEntity } = options;

        const verificationStatus = getValueFromMap("verificationStatus", trackedEntity);

        if (verificationStatus === "VERIFIED") {
            const alerts: Alert[] =
                trackedEntity.enrollments?.flatMap(enrollment =>
                    enrollment.events?.map(event => {
                        const dataValues = event.dataValues;

                        return {
                            type: outbreakType,
                            alertId: event.event,
                            eventDate: event.createdAt,
                            orgUnit: trackedEntity.orgUnit,
                            "Suspected Cases": getDataValueFromMap("Suspected Cases", dataValues),
                            "Probable Cases": getDataValueFromMap("Probable Cases", dataValues),
                            "Confirmed Cases": getDataValueFromMap("Confirmed Cases", dataValues),
                            Deaths: getDataValueFromMap("Deaths", dataValues),
                        };
                    })
                ) ?? [];

            const synchronizationData: AlertSynchronizationData = {
                lastSyncTime: new Date().toISOString(),
                type: outbreakType,
                nationalTrackedEntityEventId: nationalTrackedEntityEventId,
                [outbreakType]: outbreakKey,
                alerts: alerts,
            };

            return this.dataStoreClient
                .getObject<AlertSynchronizationData>(outbreakKey)
                .flatMap(outbreakData => {
                    const syncData: AlertSynchronizationData = !outbreakData
                        ? synchronizationData
                        : {
                              ...outbreakData,
                              lastSyncTime: new Date().toISOString(),
                              alerts: [...outbreakData.alerts, ...alerts],
                          };

                    return this.dataStoreClient.saveObject<AlertSynchronizationData>(
                        outbreakKey,
                        syncData
                    );
                });
        }

        return Future.success(undefined);
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
