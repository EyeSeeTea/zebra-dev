import { IncidentManagementTeamMemberFormData } from "../../../../domain/entities/ConfigurableForm";
import { FormState } from "../../../components/form/FormState";
import { mapTeamMemberToUser, mapToPresentationOptions } from "../mapEntityToFormState";
import { Option as UIOption } from "../../../components/utils/option";
import { User } from "../../../components/user-selector/UserSelector";
import {
    INCIDENT_MANAGER_ROLE,
    incidentManagementTeamBuilderCodesWithoutRoles,
} from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";

export const TEAM_ROLE_FIELD_ID = "team-role-field";
export const SECTION_IDS = {
    teamRole: "team-role-section",
    teamMemberAssigned: `${incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned}-section`,
    reportsTo: `${incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername}-section`,
};

export function mapIncidentManagementTeamMemberToInitialFormState(
    formData: IncidentManagementTeamMemberFormData
): FormState {
    const {
        entity: incidentManagementTeamMember,
        eventTrackerDetails,
        options,
        incidentManagementTeamRoleId,
        currentIncidentManagementTeam,
    } = formData;

    const { roles, teamMembers, incidentManagers } = options;

    const roleOptions: UIOption[] = mapToPresentationOptions(roles);
    const roleOptionsWithoutIncidentManager: UIOption[] = mapToPresentationOptions(
        roles.filter(role => role.id !== INCIDENT_MANAGER_ROLE)
    );
    const teamMemberOptions: User[] = teamMembers.map(tm => mapTeamMemberToUser(tm));
    const incidentManagerOptions: User[] = incidentManagers.map(tm => mapTeamMemberToUser(tm));
    const currentIncidentManagementTeamOptions: User[] = (
        currentIncidentManagementTeam?.teamHierarchy || []
    ).map(tm => mapTeamMemberToUser(tm));
    const teamRoleToAssing = incidentManagementTeamMember?.teamRoles?.find(
        teamRole => teamRole.id === incidentManagementTeamRoleId
    );

    return {
        id: incidentManagementTeamMember?.id || "",
        title: "Incident Management Team Builder",
        subtitle: eventTrackerDetails.name,
        saveButtonLabel: "Save Assignment",
        isValid: false,
        sections: [
            {
                title: "Role",
                id: SECTION_IDS.teamRole,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: TEAM_ROLE_FIELD_ID,
                        placeholder: "Select a role",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options:
                            teamRoleToAssing?.roleId === INCIDENT_MANAGER_ROLE
                                ? roleOptions
                                : roleOptionsWithoutIncidentManager,
                        value: teamRoleToAssing?.roleId || "",
                        required: true,
                        showIsRequired: true,
                        disabled: teamRoleToAssing?.roleId === INCIDENT_MANAGER_ROLE,
                    },
                ],
            },
            {
                title: "Team member assigned",
                id: SECTION_IDS.teamMemberAssigned,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned,
                        placeholder: "Select a team member",
                        helperText: "Only available team members are shown",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options:
                            teamRoleToAssing?.roleId === INCIDENT_MANAGER_ROLE
                                ? incidentManagerOptions
                                : teamMemberOptions,
                        value: incidentManagementTeamMember?.username || "",
                        required: true,
                        showIsRequired: true,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Reports to...",
                id: SECTION_IDS.reportsTo,
                isVisible: true,
                required: teamRoleToAssing?.roleId !== INCIDENT_MANAGER_ROLE,
                fields: [
                    {
                        id: incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername,
                        placeholder: "Select a team member",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: currentIncidentManagementTeamOptions.map(user => ({
                            ...user,
                            disabled: user.value === incidentManagementTeamMember?.username,
                        })),
                        value: teamRoleToAssing?.reportsToUsername || "",
                        required: teamRoleToAssing?.roleId !== INCIDENT_MANAGER_ROLE,
                        showIsRequired: teamRoleToAssing?.roleId !== INCIDENT_MANAGER_ROLE,
                        disabled: false,
                    },
                ],
            },
        ],
    };
}
