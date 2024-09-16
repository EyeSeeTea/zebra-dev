import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { AnalyticsRepository } from "../repositories/AnalyticsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { Indicator717PerformanceBaseAttrs } from "../../data/repositories/AnalyticsD2Repository";

export class Get717PerformanceUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
            analytics: AnalyticsRepository;
        }
    ) {}

    public execute(
        filters?: Record<string, string[]>
    ): FutureData<Indicator717PerformanceBaseAttrs[]> {
        return this.options.analytics.get717Performance(filters);
    }
}
