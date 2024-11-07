import { FutureData } from "../../../../data/api-futures";
import { incidentManagementTeamBuilderCodesWithoutRoles } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { Maybe } from "../../../../utils/ts-utils";
import { SECTION_IDS } from "../../../../webapp/pages/form-page/incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";
import { Configurations } from "../../../entities/AppConfigurations";
import { IncidentManagementTeamMemberFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { TeamRole, TeamMember } from "../../../entities/TeamMember";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { RoleRepository } from "../../../repositories/RoleRepository";
import { getIncidentManagementTeamById } from "./GetIncidentManagementTeamById";

export function getIncidentManagementConfigurableForm(
    incidentManagementTeamRoleId: Maybe<Id>,
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations,
    repositories: {
        roleRepository: RoleRepository;
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    }
): FutureData<IncidentManagementTeamMemberFormData> {
    return getIncidentManagementTeamById(eventTrackerDetails.id, repositories).flatMap(
        incidentManagementTeam => {
            const { teamMembers, roles } = configurations;
            const { incidentManagementTeamRoleConfigurations } = configurations.selectableOptions;

            const teamMemberSelected = incidentManagementTeam?.teamHierarchy.find(teamMember =>
                teamMember.teamRoles?.some(teamRole => teamRole.id === incidentManagementTeamRoleId)
            );

            const teamRoles: TeamRole[] | undefined = teamMemberSelected?.teamRoles
                ? teamMemberSelected.teamRoles.map((teamRole): TeamRole => {
                      const role = roles.find(role => role.id === teamRole.roleId);
                      return {
                          id: teamRole.id,
                          diseaseOutbreakId: eventTrackerDetails.id,
                          roleId: teamRole.roleId,
                          reportsToUsername: teamRole.reportsToUsername,
                          name: role?.name || "",
                      };
                  })
                : undefined;

            const teamMemberSelectedWithoutRoles = teamMembers.all?.find(teamMember => {
                return teamMember.username === teamMemberSelected?.username;
            });

            const teamMember: Maybe<TeamMember> = teamMemberSelectedWithoutRoles
                ? new TeamMember({
                      ...teamMemberSelectedWithoutRoles,
                      teamRoles: teamRoles,
                  })
                : undefined;

            const incidentManagementTeamMemberFormData: IncidentManagementTeamMemberFormData = {
                type: "incident-management-team-member-assignment",
                eventTrackerDetails: eventTrackerDetails,
                entity: teamMember,
                incidentManagementTeamRoleId: incidentManagementTeamRoleId,
                currentIncidentManagementTeam: incidentManagementTeam,
                options: {
                    roles: incidentManagementTeamRoleConfigurations.roles,
                    teamMembers: incidentManagementTeamRoleConfigurations.teamMembers.filter(
                        teamMembers => teamMembers.status === "Available"
                    ),
                    incidentManagers:
                        incidentManagementTeamRoleConfigurations.incidentManagers.filter(
                            teamMembers => teamMembers.status === "Available"
                        ),
                },
                labels: {
                    errors: {
                        field_is_required: "This field is required",
                        cannot_create_cyclycal_dependency:
                            "Cannot depend on itself in the team hierarchy",
                    },
                },
                rules: [
                    {
                        type: "disableFieldOptionWithSameFieldValue",
                        fieldId: incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned,
                        fieldIdsToDisableOption: [
                            incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername,
                        ],
                        sectionsWithFieldsToDisableOption: [SECTION_IDS.reportsTo],
                    },
                    {
                        type: "disableFieldOptionWithSameFieldValue",
                        fieldId: incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername,
                        fieldIdsToDisableOption: [
                            incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned,
                        ],
                        sectionsWithFieldsToDisableOption: [SECTION_IDS.teamMemberAssigned],
                    },
                ],
            };
            return Future.success(incidentManagementTeamMemberFormData);
        }
    );
}
