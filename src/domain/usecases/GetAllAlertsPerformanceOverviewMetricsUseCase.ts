import { FutureData } from "../../data/api-futures";
import { AlertsPerformanceOverviewMetrics } from "../entities/alert/AlertsPerformanceOverviewMetrics";
import { Future } from "../entities/generic/Future";
import { AlertRepository } from "../repositories/AlertRepository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";
import { Option } from "../entities/Ref";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";
import _ from "../entities/generic/Collection";

export class GetAllAlertsPerformanceOverviewMetricsUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
            alertRepository: AlertRepository;
            configurationsRepository: ConfigurationsRepository;
        }
    ) {}

    public execute(): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return Future.joinObj({
            alertMetrics:
                this.options.performanceOverviewRepository.getAlertsPerformanceOverviewMetrics(),
            diseaseOptions: this.getDiseaseOptions(),
        }).flatMap(({ alertMetrics, diseaseOptions }) => {
            const updatedAlertsMetrics$ = alertMetrics.map(alertMetric => {
                const alertId = alertMetric.teiId;
                // Fetch active alert from alerts program, as we need the ability to update it
                //and see the update reflected real-time. Fetching alert data from analytics
                //has stale data until the next analytics run is completed.
                return this.options.alertRepository.getById(alertId).map(alert => {
                    const confirmedDiseaseName = alert.confirmedDiseaseCode
                        ? diseaseOptions.find(option => option.id === alert.confirmedDiseaseCode)
                              ?.name
                        : alertMetric.suspectedDisease;

                    const activeAlert: AlertsPerformanceOverviewMetrics | undefined =
                        alert.status === "ACTIVE"
                            ? {
                                  ...alertMetric,
                                  suspectedDisease: confirmedDiseaseName ?? "",
                                  incidentStatus: alert.incidentStatus ? alert.incidentStatus : "",
                              }
                            : undefined;
                    return activeAlert;
                });
            });

            return Future.parallel(updatedAlertsMetrics$, { concurrency: 10 }).map(
                (updatedAlertsMetrics: (AlertsPerformanceOverviewMetrics | undefined)[]) => {
                    const updated: AlertsPerformanceOverviewMetrics[] = _(updatedAlertsMetrics)
                        .compact()
                        .value();
                    return updated;
                }
            );
        });
    }

    private getDiseaseOptions(): FutureData<Option[]> {
        return this.options.configurationsRepository
            .getSelectableOptions()
            .flatMap(selectableOptions => {
                const { suspectedDiseases } = selectableOptions.eventTrackerConfigurations;

                return Future.success(suspectedDiseases);
            });
    }
}
