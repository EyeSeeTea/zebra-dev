import { FutureData } from "../../data/api-futures";
import { MainSyndrome } from "../entities/disease-outbreak-event/MainSyndrome";
import { MainSyndromeRepository } from "../repositories/MainSyndromeRepository";

export class GetMainSyndromesUseCase {
    constructor(
        private options: {
            mainSyndromeRepository: MainSyndromeRepository;
        }
    ) {}

    public execute(): FutureData<MainSyndrome[]> {
        return this.options.mainSyndromeRepository.getAll();
    }
}
