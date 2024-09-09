import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
} from "./consts/DiseaseOutbreakConstants";
import { AlertOptions, AlertRepository } from "../../domain/repositories/AlertRepository";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Alert } from "../../domain/entities/alert/Alert";

export type Filter = {
    id: Id;
    value: Maybe<string>;
};

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]> {
        const { dataSource, eventId, hazardTypeCode, incidentStatus, suspectedDiseaseCode } =
            alertOptions;
        const filter = this.getAlertFilter(dataSource, suspectedDiseaseCode, hazardTypeCode);

        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            filter: filter,
        }).flatMap(alertTrackedEntities => {
            const alertsToMap = alertTrackedEntities.map(trackedEntity => ({
                id: trackedEntity.trackedEntity || "",
                trackedEntityType: RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
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

            if (alertsToMap.length === 0) return Future.success([]);

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
                else return Future.success(alertsToMap);
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
            case DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS:
                return { id: RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID, value: suspectedDiseaseCode };
            case DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS:
                return { id: RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID, value: hazardTypeCode };
        }
    }
}
