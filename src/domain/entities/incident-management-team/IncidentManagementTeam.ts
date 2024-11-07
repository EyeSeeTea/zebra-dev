import { Maybe } from "../../../utils/ts-utils";
import { TEAM_ROLE_FIELD_ID } from "../../../webapp/pages/form-page/incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";
import { Struct } from "../generic/Struct";
import { ValidationError } from "../ValidationError";
import { TeamMember } from "./TeamMember";

interface IncidentManagementTeamAttrs {
    lastUpdated: Maybe<Date>;
    teamHierarchy: TeamMember[];
}

export class IncidentManagementTeam extends Struct<IncidentManagementTeamAttrs>() {
    static validateNotCyclicalDependency(
        teamMember: string | undefined,
        reportsToUsername: string | undefined,
        currentIncidentManagementTeamHierarchy: TeamMember[],
        property: string
    ): ValidationError[] {
        const descendantsUsernamesByParentUsername = getAllDescendantsUsernamesByParentUsername(
            currentIncidentManagementTeamHierarchy
        );

        const descendantsFromTeamMember =
            descendantsUsernamesByParentUsername.get(teamMember ?? "") ?? [];

        const isCyclicalDependency = descendantsFromTeamMember.includes(reportsToUsername ?? "");

        return property === TEAM_ROLE_FIELD_ID || !isCyclicalDependency
            ? []
            : [
                  {
                      property: property,
                      value: "",
                      errors: ["cannot_create_cyclycal_dependency"],
                  },
              ];
    }
}

function getAllDescendantsUsernamesByParentUsername(
    teamMembers: TeamMember[]
): Map<string, string[]> {
    const initialMap = teamMembers.reduce((acc, member) => {
        const entries = (member.teamRoles ?? []).map(role => ({
            parentUsername: role.reportsToUsername ?? "PARENT_ROOT",
            username: member.username,
        }));

        return entries.reduce((mapAcc, { parentUsername, username }) => {
            return mapAcc.set(parentUsername, [...(mapAcc.get(parentUsername) ?? []), username]);
        }, acc);
    }, new Map<string, string[]>());

    const getDescendantUsernames = (
        parent: string,
        processedParents = new Set<string>()
    ): string[] => {
        if (processedParents.has(parent)) return [];
        processedParents.add(parent);

        return (initialMap.get(parent) ?? []).flatMap(username => [
            username,
            ...getDescendantUsernames(username, processedParents),
        ]);
    };

    return Array.from(initialMap.keys()).reduce((descendantsMap, parent) => {
        descendantsMap.set(parent, getDescendantUsernames(parent));
        return descendantsMap;
    }, new Map<string, string[]>());
}
