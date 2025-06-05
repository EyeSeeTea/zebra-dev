import { FutureData } from "../../data/api-futures";
import { Alert } from "../entities/alert/Alert";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";

export class UpdateAlertConfirmedDiseaseUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
        }
    ) {}

    public execute(alertId: Id, diseaseName: string): FutureData<void> {
        return this.fetchAndValidateAlert(alertId).flatMap(alert =>
            this.options.alertRepository.updateConfirmedDisease(alert.id, diseaseName)
        );
    }

    private fetchAndValidateAlert(alertId: Id): FutureData<Alert> {
        return this.options.alertRepository.getById(alertId).flatMap(alert => {
            if (alert.status !== "ACTIVE") {
                return Future.error(
                    new Error(
                        "This alert is not active and therefore the confirmed disease cannot be edited."
                    )
                );
            }
            return Future.success(alert);
        });
    }
}
