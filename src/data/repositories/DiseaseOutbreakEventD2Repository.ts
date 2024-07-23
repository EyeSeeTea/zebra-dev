import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, ConfigLabel } from "../../domain/entities/Ref";
import {
    mapDiseaseOutbreakEventToTrackedEntityAttributes,
    mapTrackedEntityAttributesToDiseaseOutbreak,
} from "./utils/DiseaseOutbreakMapper";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";

export class DiseaseOutbreakEventD2Repository implements DiseaseOutbreakEventRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: id,
                fields: { attributes: true, trackedEntity: true },
            })
        ).map(trackedEntity => {
            if (!trackedEntity.instances[0]) throw new Error("Tracked entity not found");
            return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity.instances[0]);
        });
    }
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
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
    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<void> {
        return apiToFuture(
            this.api.models.programs.get({
                fields: {
                    id: true,
                    programTrackedEntityAttributes: {
                        trackedEntityAttribute: {
                            id: true,
                            valueType: true,
                            code: true,
                        },
                    },
                },
                filter: {
                    id: { eq: RTSL_ZEBRA_PROGRAM_ID },
                },
            })
        ).flatMap(metadataResponse => {
            const attributesMetadata = metadataResponse.objects[0]?.programTrackedEntityAttributes;
            if (!attributesMetadata) throw new Error("Program not found");
            const trackedEntity: D2TrackerTrackedEntity =
                mapDiseaseOutbreakEventToTrackedEntityAttributes(
                    diseaseOutbreak,
                    attributesMetadata
                );

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "CREATE_AND_UPDATE" },
                    { trackedEntities: [trackedEntity] }
                )
            ).map(saveResponse => {
                if (saveResponse.status === "ERROR")
                    throw new Error("Error saving disease ooutbreak event");
            });
        });
    }
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }

    //TO DO : Implement delete/archive after requirement confirmation
}
