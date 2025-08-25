import { FutureData } from "../../data/api-futures";
import { AlertsSuspectedDisease } from "../entities/AlertsSuspectedDisease";
import { AlertsSuspectedDiseaseRepository } from "../repositories/AlertsSuspectedDiseaseRepository";

export class GetAlertsSuspectedDiseasesUseCase {
    constructor(
        private options: {
            alertsSuspectedDiseaseRepository: AlertsSuspectedDiseaseRepository;
        }
    ) {}

    public execute(): FutureData<AlertsSuspectedDisease[]> {
        return this.options.alertsSuspectedDiseaseRepository.getAll();
    }
}
