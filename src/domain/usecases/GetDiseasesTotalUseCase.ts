import { FutureData } from "../../data/api-futures";
import { TotalCardCounts } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetTotalCardCountsUseCase {
    constructor(private performanceOverviewRepository: PerformanceOverviewRepository) {}

    public execute(filters?: Record<string, string[]>): FutureData<TotalCardCounts[]> {
        return this.performanceOverviewRepository.getTotalCardCounts(filters);
    }
}
