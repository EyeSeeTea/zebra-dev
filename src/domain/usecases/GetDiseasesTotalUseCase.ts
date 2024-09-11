import { FutureData } from "../../data/api-futures";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { AnalyticsRepository } from "../repositories/AnalyticsRepository";

export class GetDiseasesTotalUseCase {
    constructor(
        private options: {
            orgUnitRepository: OrgUnitRepository;
            analytics: AnalyticsRepository;
        }
    ) {}

    public execute(
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>
    ): FutureData<any> {
        return this.options.orgUnitRepository.getByLevel(2).flatMap(allProvinces => {
            const allProvincesIds = allProvinces.map(province => province.id);
            return this.options.analytics.getDiseasesTotal(
                allProvincesIds,
                singleSelectFilters,
                multiSelectFilters
            );
        });
    }
}
