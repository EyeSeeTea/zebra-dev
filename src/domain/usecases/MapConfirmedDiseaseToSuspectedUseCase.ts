import { AlertRepository } from "../repositories/AlertRepository";
import { FutureData } from "../../data/api-futures";

export class MapConfirmedDiseaseToSuspectedUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
        }
    ) {}

    public execute(): FutureData<void> {
        return this.options.alertRepository.updateAllSuspectedDiseaseWithConfirmed();
    }
}
