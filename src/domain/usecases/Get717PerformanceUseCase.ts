import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import {
    DiseaseNames,
    PerformanceMetrics717,
    PerformanceMetrics717Key,
    PerformanceMetricsStatus,
} from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../entities/Ref";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class Get717PerformanceUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(options: {
        type: PerformanceMetrics717Key;
        diseaseOutbreakEventId: Id | undefined;
        performanceMetricsStatus: PerformanceMetricsStatus;
        diseaseName: Maybe<DiseaseNames>;
    }): FutureData<PerformanceMetrics717[]> {
        const { type, diseaseOutbreakEventId, diseaseName, performanceMetricsStatus } = options;

        if (type === "event" && diseaseOutbreakEventId) {
            return this.options.performanceOverviewRepository.getEvent717Performance(
                diseaseOutbreakEventId
            );
        } else if (type === "national") {
            return this.options.performanceOverviewRepository.getNational717Performance();
        } else if (type === "alerts") {
            return this.options.performanceOverviewRepository.getAlerts717Performance(
                performanceMetricsStatus,
                diseaseName
            );
        } else throw new Error(`Unknown 717 type: ${type} `);
    }
}
