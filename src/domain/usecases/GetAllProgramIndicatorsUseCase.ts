import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { AnalyticsRepository } from "../repositories/AnalyticsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetAllProgramIndicatorsUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
            analytics: AnalyticsRepository;
        }
    ) {}

    public execute(): FutureData<any> {
        return this.options.diseaseOutbreakEventRepository
            .getAll()
            .flatMap(diseaseOutbreakEvents => {
                return this.options.analytics.getProgramIndicators(diseaseOutbreakEvents);
            });
    }
}
