import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { Id } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError } from "../ValidationError";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";
import { TEAM_ROLE_FIELD_ID } from "../../../webapp/pages/form-page/incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";

export type DiseaseOutbreakEventAggregateRootBaseAttrs = DiseaseOutbreakEventBaseAttrs;

export type IncidentManagementTeamRole = {
    id: Id;
    roleId: Id;
    reportsToUsername: Maybe<string>;
};

export type IncidentManagementTeamMember = {
    username: string;
    teamRoles: IncidentManagementTeamRole[];
};

interface IncidentManagementTeamAttrsInAggregateRoot {
    teamHierarchy: IncidentManagementTeamMember[];
    lastUpdated: Maybe<Date>;
}

export class IncidentManagementTeamInAggregateRoot extends Struct<IncidentManagementTeamAttrsInAggregateRoot>() {}

export type DiseaseOutbreakEventAggregateRootAttrs = DiseaseOutbreakEventAggregateRootBaseAttrs & {
    riskAssessment: Maybe<RiskAssessment>;
    incidentActionPlan: Maybe<IncidentActionPlan>;
    incidentManagementTeam: Maybe<IncidentManagementTeamInAggregateRoot>;
};

export class DiseaseOutbreakEventAggregateRoot extends Struct<DiseaseOutbreakEventAggregateRootAttrs>() {
    //TODO: Add required validations if exists:
    static validate(_data: DiseaseOutbreakEventAggregateRootAttrs): ValidationError[] {
        return [];
    }

    static validateNotCyclicalDependencyInIncidentManagementTeam(
        teamMember: string | undefined,
        reportsToUsername: string | undefined,
        currentIncidentManagementTeamHierarchy: IncidentManagementTeamMember[],
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
    teamMembers: IncidentManagementTeamMember[]
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
