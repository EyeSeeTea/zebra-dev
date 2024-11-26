import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { Id } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationErrorKey } from "../ValidationError";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";
import { Either } from "../generic/Either";

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
    public static validate(_data: DiseaseOutbreakEventAggregateRootAttrs): ValidationErrorKey[] {
        return [];
    }

    public addTeamMemberToIncidentManagementTeamHierarchy(
        teamMemberUsername: string,
        roleIdAssigned: Id,
        reportsToUsername: string | undefined
    ): Either<ValidationErrorKey[], DiseaseOutbreakEventAggregateRoot> {
        const currentIncidentManagementTeamHierarchy =
            this._getAttributes().incidentManagementTeam?.teamHierarchy ?? [];

        const validationErrorKeyCyclicalDependency =
            this.validateNotCyclicalDependencyInIncidentManagementTeamHierarchy(
                teamMemberUsername,
                reportsToUsername,
                currentIncidentManagementTeamHierarchy
            );

        if (validationErrorKeyCyclicalDependency.length === 0) {
            const isTeamMemberAlreadyInHierarchy = currentIncidentManagementTeamHierarchy.some(
                member => member.username === teamMemberUsername
            );

            if (isTeamMemberAlreadyInHierarchy) {
                const updatedTeamHierarchy: IncidentManagementTeamMember[] =
                    currentIncidentManagementTeamHierarchy.map(member => {
                        return member.username === teamMemberUsername
                            ? {
                                  ...member,
                                  teamRoles: [
                                      ...(member.teamRoles ?? []),
                                      {
                                          id: "",
                                          roleId: roleIdAssigned,
                                          reportsToUsername: reportsToUsername,
                                      },
                                  ],
                              }
                            : member;
                    });

                return Either.success(
                    this._update({
                        incidentManagementTeam: new IncidentManagementTeamInAggregateRoot({
                            teamHierarchy: updatedTeamHierarchy,
                            lastUpdated: new Date(),
                        }),
                    })
                );
            } else {
                const newTeamMember: IncidentManagementTeamMember = {
                    username: teamMemberUsername,
                    teamRoles: [
                        {
                            id: "",
                            roleId: roleIdAssigned,
                            reportsToUsername: reportsToUsername,
                        },
                    ],
                };

                const updatedTeamHierarchy: IncidentManagementTeamMember[] = [
                    ...currentIncidentManagementTeamHierarchy,
                    newTeamMember,
                ];

                return Either.success(
                    this._update({
                        incidentManagementTeam: new IncidentManagementTeamInAggregateRoot({
                            teamHierarchy: updatedTeamHierarchy,
                            lastUpdated: new Date(),
                        }),
                    })
                );
            }
        } else {
            return Either.error(validationErrorKeyCyclicalDependency);
        }
    }

    private validateNotCyclicalDependencyInIncidentManagementTeamHierarchy(
        teamMemberUsername: string,
        reportsToUsername: string | undefined,
        currentIncidentManagementTeamHierarchy: IncidentManagementTeamMember[]
    ): ValidationErrorKey[] {
        if (!reportsToUsername) return [];

        const descendantsUsernamesByParentUsername = getAllDescendantsUsernamesByParentUsername(
            currentIncidentManagementTeamHierarchy
        );

        const descendantsFromTeamMember =
            descendantsUsernamesByParentUsername.get(teamMemberUsername) ?? [];

        const isCyclicalDependency = descendantsFromTeamMember.includes(reportsToUsername ?? "");

        return isCyclicalDependency ? ["cannot_create_cyclycal_dependency"] : [];
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
