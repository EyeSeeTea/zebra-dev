import { FutureData } from "../../data/api-futures";
import { Configurations, SelectableOptions } from "../entities/AppConfigurations";
import { Future } from "../entities/generic/Future";
import { Role } from "../entities/incident-management-team/Role";
import { TeamMember } from "../entities/incident-management-team/TeamMember";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { RoleRepository } from "../repositories/RoleRepository";

export class GetConfigurationsUseCase {
    constructor(
        private options: {
            teamMemberRepository: TeamMemberRepository;
            roleRepository: RoleRepository;
            configurationsRepository: ConfigurationsRepository;
        }
    ) {}

    public execute(): FutureData<Configurations> {
        return this.options.teamMemberRepository.getIncidentManagers().flatMap(managers => {
            return this.options.teamMemberRepository.getRiskAssessors().flatMap(riskAssessors => {
                return this.options.teamMemberRepository.getAll().flatMap(teamMembers => {
                    return this.options.teamMemberRepository
                        .getForIncidentManagementTeam()
                        .flatMap(teamMembersForIncidentManagementTeam => {
                            return this.options.roleRepository.getAll().flatMap(roles => {
                                return this.options.configurationsRepository
                                    .getSelectableOptions()
                                    .flatMap(selectableOptionsResponse => {
                                        const selectableOptions: SelectableOptions =
                                            this.mapOptionsAndTeamMembersToSelectableOptions(
                                                selectableOptionsResponse,
                                                managers,
                                                riskAssessors,
                                                teamMembers,
                                                teamMembersForIncidentManagementTeam,
                                                roles
                                            );
                                        const configurations: Configurations = {
                                            selectableOptions: selectableOptions,
                                            teamMembers: {
                                                all: teamMembers,
                                                riskAssessors: riskAssessors,
                                                incidentManagers: managers,
                                            },
                                            roles: roles,
                                        };
                                        return Future.success(configurations);
                                    });
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
        allTeamMembers: TeamMember[],
        teamMembersForIncidentManagementTeam: TeamMember[],
        roles: Role[]
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
                searchAssignRO: allTeamMembers,
            },
            incidentManagementTeamRoleConfigurations: {
                ...selectableOptionsResponse.incidentManagementTeamRoleConfigurations,
                roles: roles,
                teamMembers: teamMembersForIncidentManagementTeam,
                incidentManagers: managers,
            },
        };

        return selectableOptions;
    }
}
