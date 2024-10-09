import { FutureData } from "../../../../data/api-futures";
import { incidentManagementTeamBuilderCodes } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { Maybe } from "../../../../utils/ts-utils";
import { SECTION_IDS } from "../../../../webapp/pages/form-page/incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";
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
    }
): FutureData<IncidentManagementTeamMemberFormData> {
    return Future.joinObj({
        roles: repositories.roleRepository.getAll(),
        teamMembers: repositories.teamMemberRepository.getForIncidentManagementTeamMembers(),
        incidentManagers: repositories.teamMemberRepository.getIncidentManagers(),
        incidentManagementTeam: getIncidentManagementTeamById(
            eventTrackerDetails.id,
            repositories.incidentManagementTeamRepository,
            repositories.teamMemberRepository
        ),
    }).flatMap(({ roles, teamMembers, incidentManagers, incidentManagementTeam }) => {
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
                incidentManagers: incidentManagers.filter(
                    teamMembers => teamMembers.status === "Available"
                ),
            },
            labels: {
                errors: {
                    field_is_required: "This field is required",
                },
            },
            rules: [
                {
                    type: "disableFieldOptionWithSameFieldValue",
                    fieldId: incidentManagementTeamBuilderCodes.teamMemberAssigned,
                    fieldIdsToDisableOption: [incidentManagementTeamBuilderCodes.reportsToUsername],
                    sectionsWithFieldsToDisableOption: [SECTION_IDS.reportsTo],
                },
            ],
        };
        return Future.success(incidentManagementTeamMemberFormData);
    });
}
