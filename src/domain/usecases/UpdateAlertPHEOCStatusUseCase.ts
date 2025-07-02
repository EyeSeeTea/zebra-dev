import { FutureData } from "../../data/api-futures";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { Code, Id } from "../entities/Ref";
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

    public execute(alertId: Id, newPheocStatus: IncidentStatus): FutureData<void> {
        return this.fetchAndValidateAlert(alertId)
            .flatMap(alert =>
                this.fetchAndValidateMaybeDiseaseOutbreakEventId(
                    newPheocStatus,
                    alertId,
                    alert.confirmedDiseaseCode
                )
            )
            .flatMap(diseaseOutbreakId =>
                this.updateStatus(alertId, newPheocStatus, diseaseOutbreakId)
            );
    }

    private fetchAndValidateAlert(alertId: Id): FutureData<Alert> {
        return this.options.alertRepository.getById(alertId).flatMap(alert => {
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
        newPheocStatus: IncidentStatus,
        alertId: Id,
        alertConfirmedDisease: Maybe<Code>
    ): FutureData<Maybe<Id>> {
        if (newPheocStatus === "Respond" && alertConfirmedDisease) {
            return this.options.diseaseOutbreakEventRepository
                .getActiveByDisease(alertConfirmedDisease)
                .flatMap(maybeDiseaseOutbreakEvent => {
                    if (!maybeDiseaseOutbreakEvent?.id) {
                        console.error(
                            `No active disease outbreak event found for disease ${alertConfirmedDisease}`
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
