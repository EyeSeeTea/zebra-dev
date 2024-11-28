import { FutureData } from "../../data/api-futures";
import { OverviewCard } from "../entities/PerformanceOverview";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetOverviewCardsUseCase {
    constructor(private performanceOverviewRepository: PerformanceOverviewRepository) {}

    public execute(type: string): FutureData<OverviewCard[]> {
        return this.performanceOverviewRepository.getEventTrackerOverviewMetrics(type);
    }
}
