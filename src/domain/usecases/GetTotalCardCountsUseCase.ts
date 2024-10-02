import { FutureData } from "../../data/api-futures";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { TotalCardCounts } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetTotalCardCountsUseCase {
    constructor(
        private options: {
            orgUnitRepository: OrgUnitRepository;
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}
    public execute(
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>
    ): FutureData<TotalCardCounts[]> {
        return this.options.orgUnitRepository.getByLevel(2).flatMap(allProvinces => {
            const allProvincesIds = allProvinces.map(province => province.id);
            return this.options.performanceOverviewRepository.getTotalCardCounts(
                allProvincesIds,
                singleSelectFilters,
                multiSelectFilters
            );
        });
    }
}
