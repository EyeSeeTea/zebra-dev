import { FutureData } from "../../data/api-futures";
import { AlertsPerformanceOverviewMetrics } from "../entities/alert/AlertsPerformanceOverviewMetrics";
import { Id } from "../entities/Ref";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetMappedAlertsUseCase {
    constructor(
        private options: { performanceOverviewRepository: PerformanceOverviewRepository }
    ) {}

    public execute(diseaseOutbreakId: Id): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return this.options.performanceOverviewRepository.getMappedAlerts(diseaseOutbreakId);
    }
}
