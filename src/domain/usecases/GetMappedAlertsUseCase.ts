import { FutureData } from "../../data/api-futures";
import { Alert } from "../entities/alert/Alert";
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
        return this.options.performanceOverviewRepository
            .getMappedAlerts(diseaseOutbreakId)
            .flatMap((alertMetrics: AlertsPerformanceOverviewMetrics[]) => {
                // Fetching alert data from analytics has stale data until the next analytics run is completed.
                return this.options.alertRepository
                    .getAlertsByDiseaseOutbreakId(diseaseOutbreakId)
                    .flatMap((alerts: Alert[]) => {
                        const alertIdsWithDiseaseOutbreakId = alerts
                            .filter(alert => alert.diseaseOutbreakId === diseaseOutbreakId)
                            .map(alert => alert.id);

                        const alertsPerformanceOverviewMetrics = alertMetrics.filter(alert =>
                            alertIdsWithDiseaseOutbreakId.includes(alert.teiId)
                        );
                        return Future.success(alertsPerformanceOverviewMetrics);
                    });
            });
    }
}
