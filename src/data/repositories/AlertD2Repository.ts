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
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type Filter = {
    id: Id;
    value: Maybe<string>;
};

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateAlerts(alertOptions: AlertOptions): FutureData<void> {
        const { dataSource, eventId, hazardTypeCode, incidentStatus, suspectedDiseaseCode } =
            alertOptions;
        const filter = this.getAlertFilter(dataSource, suspectedDiseaseCode, hazardTypeCode);

        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            filter: filter,
        }).flatMap(response => {
            const alertsToMap = response.map(trackedEntity => ({
                ...trackedEntity,
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

    async getTrackedEntitiesByTEACodeAsync(options: {
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
                                    dataValues: {
                                        dataElement: true,
                                        value: true,
                                    },
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

    private getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter: Filter;
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
}
