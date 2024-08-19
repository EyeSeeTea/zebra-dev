import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { AlertOptions, AlertRepository } from "../../domain/repositories/AlertRepository";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateEventIdInAlerts(alertOptions: AlertOptions): FutureData<void> {
        const { eventId, filter } = alertOptions;

        return this.getTrackedEntitiesByTEACode(filter).flatMap(response => {
            const trackedEntitiesToPost = response.map(trackedEntity => ({
                ...trackedEntity,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_EVENT_ID_TEA_ID,
                        value: eventId,
                    },
                ],
            }));

            if (trackedEntitiesToPost.length === 0) return Future.success(undefined);

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: trackedEntitiesToPost }
                )
            ).map(saveResponse => {
                if (saveResponse.status === "ERROR")
                    throw new Error("Error mapping disease outbreak event id to alert");
            });
        });
    }

    private async getTrackedEntitiesByTEACodeAsync(filter: { id: Id; value: string }) {
        const d2TrackerTrackedEntities: D2TrackerTrackedEntity[] = [];

        const pageSize = 250;
        let page = 1;
        let result: TrackedEntitiesGetResponse;

        try {
            do {
                result = await this.api.tracker.trackedEntities
                    .get({
                        program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                        ouMode: "DESCENDANTS",
                        totalPages: true,
                        page: page,
                        pageSize: pageSize,
                        fields: {
                            attributes: true,
                            orgUnit: true,
                            trackedEntity: true,
                            trackedEntityType: true,
                        },
                        filter: `${filter.id}:eq:${filter.value}`,
                    })
                    .getData();

                if (!result.total) {
                    throw new Error("No tracked entities found");
                }

                d2TrackerTrackedEntities.push(...result.instances);

                page++;
            } while (result.page < Math.ceil((result.total as number) / pageSize));
            return d2TrackerTrackedEntities;
        } catch {
            return [];
        }
    }

    private getTrackedEntitiesByTEACode(filter: { id: Id; value: string }) {
        return Future.fromPromise(this.getTrackedEntitiesByTEACodeAsync(filter));
    }
}
