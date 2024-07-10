import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class GetDiseaseOutbreaksUseCase {
    constructor(private diseaseOutbreakRepository: DiseaseOutbreakEventRepository) {}

    public execute(id: Id): FutureData<DiseaseOutbreakEvent> {
        return this.diseaseOutbreakRepository.get(id);
    }
}
