import { FutureData } from "../../data/api-futures";
import {
    PerformanceMetrics717,
    PerformanceMetrics717Key,
} from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../entities/Ref";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class Get717PerformanceUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(
        type: PerformanceMetrics717Key,
        diseaseOutbreakEventId: Id | undefined
    ): FutureData<PerformanceMetrics717[]> {
        if (type === "event" && diseaseOutbreakEventId) {
            return this.options.performanceOverviewRepository.getEvent717Performance(
                diseaseOutbreakEventId
            );
        } else if (type === "national") {
            return this.options.performanceOverviewRepository.getNational717Performance();
        } else if (type === "alerts") {
            return this.options.performanceOverviewRepository.getAlerts717Performance();
        } else throw new Error(`Unknown 717 type: ${type} `);
    }
}
