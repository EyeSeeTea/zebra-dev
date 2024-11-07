import { FutureData } from "../../data/api-futures";
import { Configurations, SelectableOptions } from "../entities/AppConfigurations";
import { Future } from "../entities/generic/Future";
import { TeamMember } from "../entities/incident-management-team/TeamMember";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetConfigurationsUseCase {
    constructor(
        private configurationsRepository: ConfigurationsRepository,
        private teamMemberRepository: TeamMemberRepository
    ) {}

    public execute(): FutureData<Configurations> {
        return this.teamMemberRepository.getIncidentManagers().flatMap(managers => {
            return this.teamMemberRepository.getRiskAssessors().flatMap(riskAssessors => {
                return this.teamMemberRepository.getAll().flatMap(teamMembers => {
                    return this.teamMemberRepository
                        .getForIncidentManagementTeam()
                        .flatMap(teamMembersForIncidentManagementTeam => {
                            return this.configurationsRepository
                                .getSelectableOptions()
                                .flatMap(selectableOptionsResponse => {
                                    const selectableOptions: SelectableOptions =
                                        this.mapOptionsAndTeamMembersToSelectableOptions(
                                            selectableOptionsResponse,
                                            managers,
                                            riskAssessors,
                                            teamMembers
                                        );
                                    const configurations: Configurations = {
                                        selectableOptions: selectableOptions,
                                        teamMembers: {
                                            all: teamMembers,
                                            riskAssessors: riskAssessors,
                                            incidentManagers: managers,
                                            forIncidentManagementTeam:
                                                teamMembersForIncidentManagementTeam,
                                        },
                                    };
                                    return Future.success(configurations);
                                });
                        });
                });
            });
        });
    }

    mapOptionsAndTeamMembersToSelectableOptions(
        selectableOptionsResponse: SelectableOptions,
        managers: TeamMember[],
        riskAssessors: TeamMember[],
        teamMembers: TeamMember[]
    ): SelectableOptions {
        const selectableOptions: SelectableOptions = {
            eventTrackerConfigurations: {
                ...selectableOptionsResponse.eventTrackerConfigurations,
                incidentManagers: managers,
            },
            riskAssessmentGradingConfigurations: {
                ...selectableOptionsResponse.riskAssessmentGradingConfigurations,
            },
            riskAssessmentSummaryConfigurations: {
                ...selectableOptionsResponse.riskAssessmentSummaryConfigurations,
                riskAssessors: riskAssessors,
            },
            riskAssessmentQuestionnaireConfigurations: {
                ...selectableOptionsResponse.riskAssessmentQuestionnaireConfigurations,
            },
            incidentActionPlanConfigurations: {
                ...selectableOptionsResponse.incidentActionPlanConfigurations,
            },
            incidentResponseActionConfigurations: {
                ...selectableOptionsResponse.incidentResponseActionConfigurations,
                searchAssignRO: teamMembers,
            },
        };

        return selectableOptions;
    }
}
