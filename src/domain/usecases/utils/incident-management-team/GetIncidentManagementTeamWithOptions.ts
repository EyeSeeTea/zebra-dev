import { FutureData } from "../../../../data/api-futures";
import { incidentManagementTeamBuilderCodesWithoutRoles } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { Maybe } from "../../../../utils/ts-utils";
import { SECTION_IDS } from "../../../../webapp/pages/form-page/incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";
import { Configurations } from "../../../entities/AppConfigurations";
import { IncidentManagementTeamMemberFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { IncidentManagementTeamRepository } from "../../../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../../../repositories/RoleRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";
import { getIncidentManagementTeamById } from "./GetIncidentManagementTeamById";

export function getIncidentManagementTeamWithOptions(
    incidentManagementTeamRoleId: Maybe<Id>,
    eventTrackerDetails: DiseaseOutbreakEvent,
    repositories: {
        roleRepository: RoleRepository;
        teamMemberRepository: TeamMemberRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
    },
    configurations: Configurations
): FutureData<IncidentManagementTeamMemberFormData> {
    return Future.joinObj({
        roles: repositories.roleRepository.getAll(),
        teamMembers: repositories.teamMemberRepository.getForIncidentManagementTeamMembers(),
        incidentManagementTeam: getIncidentManagementTeamById(
            eventTrackerDetails.id,
            repositories,
            configurations
        ),
    }).flatMap(({ roles, teamMembers, incidentManagementTeam }) => {
        const teamMemberSelected = incidentManagementTeam?.teamHierarchy.find(teamMember =>
            teamMember.teamRoles?.some(teamRole => teamRole.id === incidentManagementTeamRoleId)
        );

        const incidentManagementTeamMemberFormData: IncidentManagementTeamMemberFormData = {
            type: "incident-management-team-member-assignment",
            eventTrackerDetails: eventTrackerDetails,
            entity: teamMemberSelected,
            incidentManagementTeamRoleId: incidentManagementTeamRoleId,
            currentIncidentManagementTeam: incidentManagementTeam,
            options: {
                roles: roles,
                teamMembers: teamMembers.filter(teamMembers => teamMembers.status === "Available"),
                incidentManagers: configurations.teamMembers.incidentManagers.filter(
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
    });
}
