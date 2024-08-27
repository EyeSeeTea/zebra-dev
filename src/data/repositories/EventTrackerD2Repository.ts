import { D2Api } from "../../types/d2-api";
import { EventTracker } from "../../domain/entities/event-tracker/EventTracker";
import { EventTrackerRepository } from "../../domain/repositories/EventTrackerRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import { assertOrError } from "./utils/AssertOrError";
import {
    mapDiseaseOutbreakEventToTrackedEntityAttributes,
    mapTrackedEntityAttributesToDiseaseOutbreak,
} from "./utils/DiseaseOutbreakMapper";
import { getProgramTEAsMetadata } from "./utils/MetadataHelper";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";

export class EventTrackerD2Repository implements EventTrackerRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<EventTracker> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: id,
                fields: { attributes: true, trackedEntity: true },
            })
        )
            .flatMap(response => assertOrError(response.instances[0], "Tracked entity"))
            .map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
    }

    getAll(): FutureData<EventTracker[]> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                fields: { attributes: true, trackedEntity: true },
            })
        ).map(response => {
            return response.instances.map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
        });
    }

    save(diseaseOutbreak: EventTracker): FutureData<void> {
        return getProgramTEAsMetadata(this.api, RTSL_ZEBRA_PROGRAM_ID).flatMap(
            teasMetadataResponse => {
                const teasMetadata =
                    teasMetadataResponse.objects[0]?.programTrackedEntityAttributes;

                if (!teasMetadata)
                    throw new Error("Program Tracked Entity Attributes metadata not found");

                const trackedEntity: D2TrackerTrackedEntity =
                    mapDiseaseOutbreakEventToTrackedEntityAttributes(diseaseOutbreak, teasMetadata);

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { trackedEntities: [trackedEntity] }
                    )
                ).map(saveResponse => {
                    if (saveResponse.status === "ERROR")
                        throw new Error("Error saving disease ooutbreak event");
                });
            }
        );
    }
}
