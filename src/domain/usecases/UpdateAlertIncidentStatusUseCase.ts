import { FutureData } from "../../data/api-futures";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";

export class UpdateAlertIncidentStatusUseCase {
    constructor(private alertRepository: AlertRepository) {}

    public execute(alertId: Id, orgUnitName: string, status: IncidentStatus): FutureData<void> {
        return this.alertRepository.updateAlertIncidentStatus(alertId, orgUnitName, status);
    }
}
