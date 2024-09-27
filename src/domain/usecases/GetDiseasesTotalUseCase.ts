import { FutureData } from "../../data/api-futures";
import { EventTrackerCounts } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetDiseasesTotalUseCase {
    constructor(private performanceOverviewRepository: PerformanceOverviewRepository) {}

    public execute(filters?: Record<string, string[]>): FutureData<EventTrackerCounts[]> {
        return this.performanceOverviewRepository.getDiseasesTotal(filters);
    }
}
