import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { OverviewCard } from "../entities/PerformanceOverview";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetOverviewCardsUseCase {
    constructor(private performanceOverviewRepository: PerformanceOverviewRepository) {}

    public execute(type: string, casesDataSource: CasesDataSource): FutureData<OverviewCard[]> {
        return this.performanceOverviewRepository.getEventTrackerOverviewMetrics(
            type,
            casesDataSource
        );
    }
}
