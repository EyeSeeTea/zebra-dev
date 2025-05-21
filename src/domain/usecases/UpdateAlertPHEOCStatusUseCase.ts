import { FutureData } from "../../data/api-futures";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class UpdateAlertPHEOCStatusUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(
        alertId: Id,
        orgUnitName: string,
        pheocStatus: IncidentStatus
    ): FutureData<void> {
        return this.options.alertRepository.getAlertById(alertId).flatMap(alert => {
            if (alert.status !== "ACTIVE") {
                return Future.error(
                    new Error(
                        "This alert is not active and therefore the PHEOC status cannot be changed."
                    )
                );
            }

            return this.options.alertRepository
                .updateAlertPHEOCStatus(alertId, orgUnitName, pheocStatus)
                .flatMap(() => {
                    const disease = alert.disease;
                    return this.options.diseaseOutbreakEventRepository
                        .getActiveByDisease(disease)
                        .flatMap(maybeDiseaseOutbreakEvent => {
                            if (maybeDiseaseOutbreakEvent) {
                                return this.options.alertRepository.updateMappedDiseaseOutbreakEventIdByPHEOCStatus(
                                    alertId,
                                    maybeDiseaseOutbreakEvent.id,
                                    pheocStatus
                                );
                            } else {
                                return Future.success(undefined);
                            }
                        });
                });
        });
    }
}
