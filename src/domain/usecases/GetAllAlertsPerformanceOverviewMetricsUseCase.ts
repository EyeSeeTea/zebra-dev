import { FutureData } from "../../data/api-futures";
import { AlertsPerformanceOverviewMetrics } from "../entities/alert/AlertsPerformanceOverviewMetrics";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetAllAlertsPerformanceOverviewMetricsUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return this.options.performanceOverviewRepository.getAlertsPerformanceOverviewMetrics();
    }
}
