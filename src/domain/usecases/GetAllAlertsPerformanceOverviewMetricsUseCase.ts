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
        // Fetch active alert from alerts program, as we need the ability to update it
        //and see the update reflected real-time. Fetching alert data from analytics
        //has stale data until the next analytics run is completed.
        return Future.joinObj({
            alertMetrics:
                this.options.performanceOverviewRepository.getAlertsPerformanceOverviewMetrics(),
            diseaseOptions: this.getDiseaseOptions(),
            activeAlerts: this.options.alertRepository.getAllActive(),
        }).flatMap(({ alertMetrics, diseaseOptions, activeAlerts }) => {
            const alertsPerformanceOverviewMetrics = alertMetrics.reduce(
                (
                    acc: AlertsPerformanceOverviewMetrics[],
                    alertMetric: AlertsPerformanceOverviewMetrics
                ): AlertsPerformanceOverviewMetrics[] => {
                    const alertId = alertMetric.teiId;
                    const activeAlert = activeAlerts.find(alert => alert.id === alertId);

                    if (!activeAlert) {
                        return acc;
                    }

                    const confirmedDiseaseName = activeAlert.confirmedDiseaseCode
                        ? diseaseOptions.find(
                              option => option.id === activeAlert.confirmedDiseaseCode
                          )?.name
                        : alertMetric.confirmedDisease;

                    const alertsPerformanceOverviewMetric: AlertsPerformanceOverviewMetrics = {
                        ...alertMetric,
                        confirmedDisease: confirmedDiseaseName ?? "",
                        incidentStatus: activeAlert.incidentStatus
                            ? activeAlert.incidentStatus
                            : "",
                    };
                    return [...acc, alertsPerformanceOverviewMetric];
                },
                []
            );

            return Future.success(alertsPerformanceOverviewMetrics);
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
