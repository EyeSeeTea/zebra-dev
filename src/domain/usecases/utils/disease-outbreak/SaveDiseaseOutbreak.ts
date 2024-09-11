import { FutureData } from "../../../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";

export function saveDiseaseOutbreak(
    diseaseOutbreakRepository: DiseaseOutbreakEventRepository,
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs
): FutureData<Id> {
    return diseaseOutbreakRepository
        .save(diseaseOutbreakEventBaseAttrs)
        .flatMap(diseaseOutbreakEventId => {
            return Future.success(diseaseOutbreakEventId);
        });
}
