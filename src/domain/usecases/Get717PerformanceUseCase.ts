import { FutureData } from "../../data/api-futures";
import { PerformanceMetrics717 } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class Get717PerformanceUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(type: "dashboard" | "event_tracker"): FutureData<PerformanceMetrics717[]> {
        if (type === "event_tracker") {
            return this.options.performanceOverviewRepository.getEventTracker717Performance();
        } else if (type === "dashboard") {
            return this.options.performanceOverviewRepository.getDashboard717Performance();
        } else throw new Error(`Unknown 717 type: ${type} `);
    }
}
