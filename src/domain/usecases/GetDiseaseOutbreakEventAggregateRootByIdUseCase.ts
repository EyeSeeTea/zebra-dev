import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventAggregateRoot } from "../entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class GetDiseaseOutbreakEventAggregateRootByIdUseCase {
    constructor(private diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository) {}

    public execute(id: Id): FutureData<DiseaseOutbreakEventAggregateRoot> {
        return this.diseaseOutbreakEventRepository.getAggregateRoot(id);
    }
}
