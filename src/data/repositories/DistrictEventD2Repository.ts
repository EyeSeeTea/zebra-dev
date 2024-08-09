import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import { mapTrackedEntityAttributesToDiseaseOutbreak } from "./utils/DiseaseOutbreakMapper";
import {
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { getProgramTEAsMetadata } from "./utils/MetadataHelper";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { DistrictEventRepository as DistrictEventRepository } from "../../domain/repositories/DistrictEventRepository";
import { mapDiseaseOutbreakEventToTrackedEntityAttributes } from "./utils/NationalToDistrictOutbreakMapper";

export class DistrictEventD2Repository implements DistrictEventRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                fields: { attributes: true, trackedEntity: true },
            })
        ).map(response => {
            return response.instances.map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
        });
    }

    save(diseaseOutbreaks: DiseaseOutbreakEventBaseAttrs[]): FutureData<void> {
        return apiToFuture(getProgramTEAsMetadata(this.api, RTSL_ZEBRA_ALERTS_PROGRAM_ID)).flatMap(
            teasMetadataResponse => {
                const teasMetadata =
                    teasMetadataResponse.objects[0]?.programTrackedEntityAttributes;

                if (!teasMetadata)
                    throw new Error("Program Tracked Entity Attributes metadata not found");

                return apiToFuture(
                    this.api.tracker.trackedEntities.get({
                        program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                        fields: { trackedEntityType: true, trackedEntity: true },
                    })
                ).flatMap(response => {
                    const tetsMetadata = response.instances;

                    const trackedEntities: D2TrackerTrackedEntity[] = diseaseOutbreaks.map(
                        diseaseOutbreak =>
                            mapDiseaseOutbreakEventToTrackedEntityAttributes(
                                diseaseOutbreak,
                                teasMetadata,
                                tetsMetadata
                            )
                    );

                    return apiToFuture(
                        this.api.tracker.post({}, { trackedEntities: trackedEntities })
                    ).map(saveResponse => {
                        if (saveResponse.status === "ERROR")
                            throw new Error("Error saving disease ooutbreak event");
                    });
                });
            }
        );
    }
}
