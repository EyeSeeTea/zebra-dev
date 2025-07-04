import { FutureData } from "../../data/api-futures";
import { OverviewCard } from "../entities/PerformanceOverview";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";
import { Maybe } from "../../utils/ts-utils";
import { DataSourceCode } from "../entities/DataSource";

export class GetOverviewCardsUseCase {
    constructor(private performanceOverviewRepository: PerformanceOverviewRepository) {}

    public execute(type: string, dataSource: Maybe<DataSourceCode>): FutureData<OverviewCard[]> {
        return this.performanceOverviewRepository.getEventTrackerOverviewMetrics(type, dataSource);
    }
}
