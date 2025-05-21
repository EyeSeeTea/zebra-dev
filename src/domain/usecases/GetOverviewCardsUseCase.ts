import { FutureData } from "../../data/api-futures";
import { DataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { OverviewCard } from "../entities/PerformanceOverview";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";
import { Maybe } from "../../utils/ts-utils";

export class GetOverviewCardsUseCase {
    constructor(private performanceOverviewRepository: PerformanceOverviewRepository) {}

    public execute(type: string, dataSource: Maybe<DataSource>): FutureData<OverviewCard[]> {
        return this.performanceOverviewRepository.getEventTrackerOverviewMetrics(type, dataSource);
    }
}
