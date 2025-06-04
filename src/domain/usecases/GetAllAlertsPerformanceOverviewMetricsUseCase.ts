import { FutureData } from "../../data/api-futures";
import { AlertsPerformanceOverviewMetrics } from "../entities/alert/AlertsPerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { AlertRepository } from "../repositories/AlertRepository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetAllAlertsPerformanceOverviewMetricsUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
            alertRepository: AlertRepository;
        }
    ) {}

    public execute(): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return this.options.performanceOverviewRepository
            .getAlertsPerformanceOverviewMetrics()
            .flatMap(alertMetrics => {
                // TODO: Fetch the completion status of the alert and filter for only active alerts
                const alertsWithStatus = alertMetrics.map(alert => {
                    const alertId = alert.teiId;
                    //R3: Fetch the incident status from alerts program, as we need the ability to update it
                    //and see the update reflected real-time. Fetching incident status from analytics
                    //has stale data until the next analytics run is completed.
                    return this.options.alertRepository
                        .getIncidentStatusByAlert(alertId)
                        .map(incidentStatus => {
                            return {
                                ...alert,
                                incidentStatus: incidentStatus ? incidentStatus : "",
                            };
                        });
                });
                return Future.parallel(alertsWithStatus, { concurrency: 10 });
            });
    }
}
