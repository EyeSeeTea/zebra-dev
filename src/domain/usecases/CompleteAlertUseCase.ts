import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";

export class CompleteAlertUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
        }
    ) {}

    public execute(alertId: Id): FutureData<void> {
        return this.options.alertRepository.complete(alertId);
    }
}
