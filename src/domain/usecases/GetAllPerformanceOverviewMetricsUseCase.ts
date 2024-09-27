import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { PerformanceOverviewMetrics } from "../../data/repositories/PerformanceOverviewD2Repository";

export class GetAllPerformanceOverviewMetricsUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
            analytics: PerformanceOverviewRepository;
        }
    ) {}

    public execute(): FutureData<PerformanceOverviewMetrics[]> {
        return this.options.diseaseOutbreakEventRepository
            .getAll()
            .flatMap(diseaseOutbreakEvents => {
                return this.options.analytics.getPerformanceOverviewMetrics(diseaseOutbreakEvents);
            });
    }
}
