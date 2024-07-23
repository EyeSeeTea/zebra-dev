import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { apiToFuture, FutureData } from "../api-futures";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, ConfigLabel } from "../../domain/entities/Ref";
import { mapTrackedEntityAttributesToDiseaseOutbreak } from "./utils/mapTrackedEntityAttributesToDiseaseOutbreak";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";

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
    save(_diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    delete(_id: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }
}
