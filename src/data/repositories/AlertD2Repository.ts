import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { AlertOptions, AlertRepository } from "../../domain/repositories/AlertRepository";
import { Id } from "../../domain/entities/Ref";

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateEventIdInAlerts(alertOptions: AlertOptions): FutureData<void> {
        const { eventId, filter } = alertOptions;

        return this.getTrackedEntitiesByTEACode(filter).flatMap(response => {
            const trackedEntitiesToPost = response.instances.map(trackedEntity => ({
                ...trackedEntity,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_EVENT_ID_TEA_ID,
                        value: eventId,
                    },
                ],
            }));

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

    private getTrackedEntitiesByTEACode(filter: { id: Id; value: string }) {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                ouMode: "DESCENDANTS",
                fields: {
                    attributes: true,
                    orgUnit: true,
                    trackedEntity: true,
                    trackedEntityType: true,
                },
                filter: `${filter.id}:eq:${filter.value}`,
            })
        );
    }
}
