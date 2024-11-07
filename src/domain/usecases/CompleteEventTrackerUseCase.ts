import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class CompleteEventTrackerUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(id: Id): FutureData<void> {
        return this.options.diseaseOutbreakEventRepository.complete(id);
    }
}
