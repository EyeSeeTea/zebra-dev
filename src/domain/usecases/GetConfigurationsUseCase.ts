import { FutureData } from "../../data/api-futures";
import { Configurations, SelectableOptions } from "../entities/AppConfigurations";
import { Future } from "../entities/generic/Future";
import { Role } from "../entities/Role";
import { TeamMember } from "../entities/TeamMember";
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
        return Future.joinObj({
            allTeamMembers: this.options.teamMemberRepository.getAll(),
            incidentResponseOfficers:
                this.options.teamMemberRepository.getIncidentResponseOfficers(),
            managers: this.options.teamMemberRepository.getIncidentManagers(),
            riskAssessors: this.options.teamMemberRepository.getRiskAssessors(),
            selectableOptionsResponse: this.options.configurationsRepository.getSelectableOptions(),
            teamMembersForIncidentManagementTeam:
                this.options.teamMemberRepository.getForIncidentManagementTeam(),
            roles: this.options.roleRepository.getAll(),
        }).flatMap(
            ({
                allTeamMembers,
                incidentResponseOfficers,
                managers,
                riskAssessors,
                selectableOptionsResponse,
                teamMembersForIncidentManagementTeam,
                roles,
            }) => {
                const selectableOptions: SelectableOptions =
                    this.mapOptionsAndTeamMembersToSelectableOptions(
                        selectableOptionsResponse,
                        managers,
                        riskAssessors,
                        incidentResponseOfficers,
                        teamMembersForIncidentManagementTeam,
                        roles
                    );

                const configurations: Configurations = {
                    selectableOptions: selectableOptions,
                    teamMembers: {
                        all: allTeamMembers,
                        riskAssessors: riskAssessors,
                        incidentManagers: managers,
                        responseOfficers: incidentResponseOfficers,
                        forIncidentManagementTeam: teamMembersForIncidentManagementTeam,
                    },
                    roles: roles,
                };
                return Future.success(configurations);
            }
        );
    }

    mapOptionsAndTeamMembersToSelectableOptions(
        selectableOptionsResponse: SelectableOptions,
        managers: TeamMember[],
        riskAssessors: TeamMember[],
        incidentResponseOfficers: TeamMember[],
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
                searchAssignRO: incidentResponseOfficers,
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
