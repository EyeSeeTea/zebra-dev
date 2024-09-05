import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class SaveDiseaseOutbreakUseCase {
    constructor(private diseaseOutbreakRepository: DiseaseOutbreakEventRepository) {}

    public execute(diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs): FutureData<void> {
        return this.diseaseOutbreakRepository
            .save(diseaseOutbreakEventBaseAttrs)
            .flatMap(diseaseOutbreakEventId => {
                console.debug(diseaseOutbreakEventId);
                return Future.success(undefined);
            });
    }
}
