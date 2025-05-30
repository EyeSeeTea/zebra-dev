import { FutureData } from "../../data/api-futures";
import { Configurations, SelectableOptions } from "../entities/AppConfigurations";
import { Future } from "../entities/generic/Future";
import { TeamMember } from "../entities/incident-management-team/TeamMember";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { UserGroupRepository } from "../repositories/UserGroupRepository";

export class GetConfigurationsUseCase {
    constructor(
        private configurationsRepository: ConfigurationsRepository,
        private teamMemberRepository: TeamMemberRepository,
        private orgUnitRepository: OrgUnitRepository,
        private userGroupRepository: UserGroupRepository
    ) {}

    public execute(): FutureData<Configurations> {
        return Future.joinObj({
            allTeamMembers: this.teamMemberRepository.getAll(),
            incidentResponseOfficers: this.teamMemberRepository.getIncidentResponseOfficers(),
            managers: this.teamMemberRepository.getIncidentManagers(),
            riskAssessors: this.teamMemberRepository.getRiskAssessors(),
            selectableOptionsResponse: this.configurationsRepository.getSelectableOptions(),
            appDefaults: this.configurationsRepository.getAppDefaults(),
            orgUnits: this.orgUnitRepository.getAll(),
            incidentManagerUserGroup: this.userGroupRepository.getIncidentManagerUserGroupByCode(),
        }).flatMap(
            ({
                allTeamMembers,
                incidentResponseOfficers,
                managers,
                riskAssessors,
                selectableOptionsResponse,
                appDefaults,
                orgUnits,
                incidentManagerUserGroup,
            }) => {
                const selectableOptions: SelectableOptions =
                    this.mapOptionsAndTeamMembersToSelectableOptions(
                        selectableOptionsResponse,
                        managers,
                        riskAssessors,
                        incidentResponseOfficers
                    );

                const configurations: Configurations = {
                    selectableOptions: selectableOptions,
                    incidentManagerUserGroup: incidentManagerUserGroup,
                    teamMembers: {
                        all: allTeamMembers,
                        riskAssessors: riskAssessors,
                        incidentManagers: managers,
                        responseOfficers: incidentResponseOfficers,
                    },
                    orgUnits,
                    appDefaults,
                };
                return Future.success(configurations);
            }
        );
    }

    mapOptionsAndTeamMembersToSelectableOptions(
        selectableOptionsResponse: SelectableOptions,
        managers: TeamMember[],
        riskAssessors: TeamMember[],
        incidentResponseOfficers: TeamMember[]
    ): SelectableOptions {
        const selectableOptions: SelectableOptions = {
            eventTrackerConfigurations: {
                ...selectableOptionsResponse.eventTrackerConfigurations,
                incidentManagers: managers,
            },
            alertOptions: {
                ...selectableOptionsResponse.alertOptions,
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
        };

        return selectableOptions;
    }
}
