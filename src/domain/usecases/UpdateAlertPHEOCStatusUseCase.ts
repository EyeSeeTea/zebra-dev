import { FutureData } from "../../data/api-futures";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";

export class UpdateAlertPHEOCStatusUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(alertId: Id, pheocStatus: IncidentStatus): FutureData<void> {
        return this.fetchAndValidateAlert(alertId)
            .flatMap(alert => this.fetchAndValidateMaybeDiseaseOutbreakEventId(pheocStatus, alert))
            .flatMap(diseaseOutbreakId =>
                this.updateStatus(alertId, pheocStatus, diseaseOutbreakId)
            );
    }

    private fetchAndValidateAlert(alertId: Id): FutureData<Alert> {
        return this.options.alertRepository.getAlertById(alertId).flatMap(alert => {
            if (alert.status !== "ACTIVE") {
                return Future.error(
                    new Error(
                        "This alert is not active and therefore the PHEOC status cannot be changed."
                    )
                );
            }
            return Future.success(alert);
        });
    }

    private fetchAndValidateMaybeDiseaseOutbreakEventId(
        pheocStatus: IncidentStatus,
        alert: Alert
    ): FutureData<Maybe<Id>> {
        if (pheocStatus === "Respond") {
            return this.options.diseaseOutbreakEventRepository
                .getActiveByDisease(alert.disease)
                .flatMap(maybeDiseaseOutbreakEvent => {
                    if (!maybeDiseaseOutbreakEvent?.id) {
                        console.error(
                            `No active disease outbreak event found for disease ${alert.disease}`
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
        pheocStatus: IncidentStatus,
        diseaseOutbreakId: Maybe<Id>
    ): FutureData<void> {
        return this.options.alertRepository.updateAlertPHEOCStatus({
            alertId,
            pheocStatus,
            diseaseOutbreakId,
        });
    }
}
