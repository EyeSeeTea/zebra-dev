import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class GetAllDiseaseOutbreaksUseCase {
    constructor(private diseaseOutbreakRepository: DiseaseOutbreakEventRepository) {}

    public execute(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return this.diseaseOutbreakRepository.getAll();
    }
}
