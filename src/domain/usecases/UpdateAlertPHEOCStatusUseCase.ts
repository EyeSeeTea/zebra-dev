import { FutureData } from "../../data/api-futures";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { Maybe } from "../../utils/ts-utils";
import { Alert, UNKNOWN_DISEASE_CODE, UNCONFIRMABLE_DISEASE_CODE } from "../entities/alert/Alert";

export class UpdateAlertPHEOCStatusUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(alertId: Id, newPheocStatus: IncidentStatus): FutureData<void> {
        return this.fetchAndValidateAlert(alertId)
            .flatMap(alert =>
                this.fetchAndValidateMaybeDiseaseOutbreakEventId(newPheocStatus, alert)
            )
            .flatMap(maybeDiseaseOutbreakId =>
                this.updateStatus(alertId, newPheocStatus, maybeDiseaseOutbreakId)
            );
    }

    private fetchAndValidateAlert(alertId: Id): FutureData<Alert> {
        return this.options.alertRepository.getById(alertId).flatMap(alert => {
            if (
                alert.status !== "ACTIVE" ||
                !alert.confirmedDiseaseCode ||
                alert.confirmedDiseaseCode === UNKNOWN_DISEASE_CODE
            ) {
                return Future.error(
                    new Error(
                        alert.status !== "ACTIVE"
                            ? "This alert is not active and therefore the PHEOC status cannot be changed."
                            : "An alert without a confirmed disease cannot change its PHEOC status."
                    )
                );
            }
            return Future.success(alert);
        });
    }

    private fetchAndValidateMaybeDiseaseOutbreakEventId(
        newPheocStatus: IncidentStatus,
        alert: Alert
    ): FutureData<Maybe<Id>> {
        if (
            newPheocStatus === "Respond" &&
            alert.confirmedDiseaseCode &&
            alert.confirmedDiseaseCode !== UNKNOWN_DISEASE_CODE &&
            alert.confirmedDiseaseCode !== UNCONFIRMABLE_DISEASE_CODE
        ) {
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

    private updateStatus(
        alertId: Id,
        newPheocStatus: IncidentStatus,
        diseaseOutbreakId: Maybe<Id>
    ): FutureData<void> {
        return this.options.alertRepository.updateAlertPHEOCStatusAndMappedEventId({
            alertId,
            pheocStatus: newPheocStatus,
            diseaseOutbreakId,
        });
    }
}
