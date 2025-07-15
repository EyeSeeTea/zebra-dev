import { FutureData } from "../../data/api-futures";
import { AlertsPerformanceOverviewMetrics } from "../entities/alert/AlertsPerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetMappedAlertsUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
            alertRepository: AlertRepository;
        }
    ) {}

    public execute(diseaseOutbreakId: Id): FutureData<AlertsPerformanceOverviewMetrics[]> {
        // Fetching alert data from analytics has stale data until the next analytics run is completed.
        return Future.joinObj({
            alertMetrics:
                this.options.performanceOverviewRepository.getMappedAlerts(diseaseOutbreakId),
            alerts: this.options.alertRepository.getAlertsByDiseaseOutbreakId(diseaseOutbreakId),
        }).flatMap(({ alertMetrics, alerts }) => {
            const alertIdsWithDiseaseOutbreakId = alerts.map(alert => alert.id);

            const alertsPerformanceOverviewMetrics = alertMetrics.filter(alert =>
                alertIdsWithDiseaseOutbreakId.includes(alert.teiId)
            );
            return Future.success(alertsPerformanceOverviewMetrics);
        });
    }
}
