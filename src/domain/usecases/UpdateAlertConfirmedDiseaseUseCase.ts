import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class UpdateAlertConfirmedDiseaseUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(alertId: Id, diseaseName: string): FutureData<void> {
        return this.options.alertRepository.updateConfirmedDisease(alertId, diseaseName);
    }
}
