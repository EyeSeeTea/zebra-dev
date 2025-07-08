import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import { Future } from "../entities/generic/Future";
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
        return this.fetchAndValidateAlert(alertId, diseaseName).flatMap(alert =>
            this.fetchAndValidateMaybeDiseaseOutbreakEventId(alert).flatMap(
                maybeDiseaseOutbreakId =>
                    this.options.alertRepository.updateConfirmedDiseaseAndChangeMappedEventId(
                        alert.id,
                        diseaseName,
                        maybeDiseaseOutbreakId
                    )
            )
        );
    }

    private fetchAndValidateAlert(alertId: Id, confirmedDiseaseName: string): FutureData<Alert> {
        return this.options.alertRepository.getById(alertId).flatMap(alert => {
            if (alert.status !== "ACTIVE" || confirmedDiseaseName === "Unknown") {
                return Future.error(
                    new Error(
                        alert.status !== "ACTIVE"
                            ? "This alert is not active and therefore the confirmed disease cannot be edited."
                            : "Unknown cannot be set as confirmed disease."
                    )
                );
            }
            return Future.success(alert);
        });
    }

    private fetchAndValidateMaybeDiseaseOutbreakEventId(alert: Alert): FutureData<Maybe<Id>> {
        if (alert.incidentStatus === "Respond" && alert.confirmedDiseaseCode) {
            return this.options.diseaseOutbreakEventRepository
                .getActiveByDisease(alert.confirmedDiseaseCode)
                .flatMap(maybeDiseaseOutbreakEvent => {
                    if (!maybeDiseaseOutbreakEvent?.id) {
                        console.error(
                            `No active disease outbreak event found for disease ${alert.confirmedDiseaseCode}`
                        );
                        return Future.success(undefined);
                    }
                    return Future.success(maybeDiseaseOutbreakEvent.id);
                });
        }
        return Future.success(undefined);
    }
}
