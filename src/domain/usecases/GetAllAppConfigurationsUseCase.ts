import { FutureData } from "../../data/api-futures";
import { AppConfigurations } from "../entities/AppConfigurations";
import { Future } from "../entities/generic/Future";
import { AppConfigurationRepository } from "../repositories/AppConfigurationRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetAllAppConfigurationsUseCase {
    constructor(
        private appConfigurationRepository: AppConfigurationRepository,
        private teamMemberRepository: TeamMemberRepository
    ) {}

    public execute(): FutureData<AppConfigurations> {
        return this.teamMemberRepository.getIncidentManagers().flatMap(managers => {
            return this.teamMemberRepository.getRiskAssessors().flatMap(riskAssessors => {
                return this.teamMemberRepository.getAll().flatMap(teamMembers => {
                    return this.appConfigurationRepository
                        .getAppConfigurations()
                        .flatMap(config => {
                            const appConfig: AppConfigurations = {
                                eventTrackerConfigurations: {
                                    ...config.eventTrackerConfigurations,
                                    incidentManagers: managers,
                                },
                                riskAssessmentGradingConfigurations: {
                                    ...config.riskAssessmentGradingConfigurations,
                                },
                                riskAssessmentSummaryConfigurations: {
                                    ...config.riskAssessmentSummaryConfigurations,
                                    riskAssessors: riskAssessors,
                                },
                                riskAssessmentQuestionnaireConfigurations: {
                                    ...config.riskAssessmentQuestionnaireConfigurations,
                                },
                                incidentActionPlanConfigurations: {
                                    ...config.incidentActionPlanConfigurations,
                                },
                                incidentResponseActionConfigurations: {
                                    ...config.incidentResponseActionConfigurations,
                                    searchAssignRO: teamMembers,
                                },
                            };
                            return Future.success(appConfig);
                        });
                });
            });
        });
    }
}
