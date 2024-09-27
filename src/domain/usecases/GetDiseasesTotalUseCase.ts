import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { DiseaseTotalAttrs } from "../../data/repositories/PerformanceOverviewD2Repository";

export class GetDiseasesTotalUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
            analytics: PerformanceOverviewRepository;
        }
    ) {}

    public execute(filters?: Record<string, string[]>): FutureData<DiseaseTotalAttrs[]> {
        return this.options.analytics.getDiseasesTotal(filters);
    }
}
