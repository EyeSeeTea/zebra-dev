import { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";

import _c from "../../../domain/entities/generic/Collection";
import { getPopulatedDataElement, getValueById } from "./helpers";
import {
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "../consts/DiseaseOutbreakConstants";
import { TeamMember, TeamRole } from "../../../domain/entities/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import {
    incidentManagementTeamBuilderCodesWithoutRoles,
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES,
} from "../consts/IncidentManagementTeamBuilderConstants";
import { D2ProgramStageDataElementsMetadata } from "./MetadataHelper";
import {
    IncidentManagementTeamInAggregateRoot,
    IncidentManagementTeamRole,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { getISODateAsLocaleDateString } from "./DateTimeHelper";

export function mapIncidentManagementTeamMemberToD2Event(
    teamMemberRole: TeamRole,
    incidentManagementTeamMember: TeamMember,
    teiId: Id,
    enrollmentId: Id,
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent {
    const dataElementValues = getValueFromIncidentManagementTeamMember(
        incidentManagementTeamMember.username,
        teamMemberRole,
        incidentManagementTeamProgramStageDataElements
    );

    const dataValues: DataValue[] = incidentManagementTeamProgramStageDataElements.map(
        programStage => {
            const typedCode = programStage.dataElement.code;
            return getPopulatedDataElement(
                programStage.dataElement.id,
                dataElementValues[typedCode]
            );
        }
    );

    const d2IncidentManagementTeam: D2TrackerEvent = {
        event: teamMemberRole.id ?? "",
        status: "ACTIVE",
        program: RTSL_ZEBRA_PROGRAM_ID,
        programStage: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
        enrollment: enrollmentId,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        occurredAt: new Date().toISOString(),
        dataValues: dataValues,
        trackedEntity: teiId,
    };

    return d2IncidentManagementTeam;
}

function getValueFromIncidentManagementTeamMember(
    incidentManagementTeamMemberUsername: string,
    teamRoleAssigned: TeamRole,
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): Record<string, string> {
    const checkRoleSelected = (roleId: string): boolean =>
        (teamRoleAssigned?.roleId || "") === roleId;

    const rolesObjByCode = incidentManagementTeamProgramStageDataElements.reduce(
        (acc, programStage) => {
            if (
                programStage.dataElement.code ===
                    incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned ||
                programStage.dataElement.code ===
                    incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername
            ) {
                return acc;
            } else {
                return {
                    ...acc,
                    [programStage.dataElement.code]: checkRoleSelected(programStage.dataElement.id)
                        ? "true"
                        : "",
                };
            }
        },
        {}
    );

    return {
        [incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned]:
            incidentManagementTeamMemberUsername,
        [incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername]:
            teamRoleAssigned?.reportsToUsername ?? "",
        ...rolesObjByCode,
    };
}

export function mapD2EventsToIncidentManagementTeamInAggregateRoot(
    d2Events: D2TrackerEvent[],
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): IncidentManagementTeamInAggregateRoot {
    const incidentManagementTeamRolesByUsername = getIncidentManagementTeamRolesByUsername(
        d2Events,
        incidentManagementTeamProgramStageDataElements
    );

    const incidentManagementTeamMembers = Object.keys(incidentManagementTeamRolesByUsername).map(
        username => {
            const teamRoles = incidentManagementTeamRolesByUsername[username];
            return teamRoles
                ? {
                      username: username,
                      teamRoles: teamRoles,
                  }
                : null;
        }
    );

    const sortedByUpdatedDates = d2Events.sort(function (a, b) {
        if (!a.updatedAt) return -1;
        if (!b.updatedAt) return 1;
        return a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0;
    });

    return new IncidentManagementTeamInAggregateRoot({
        teamHierarchy: _c(incidentManagementTeamMembers).compact().toArray(),
        lastUpdated: sortedByUpdatedDates[0]?.updatedAt
            ? getISODateAsLocaleDateString(sortedByUpdatedDates[0]?.updatedAt)
            : undefined,
    });
}

function getIncidentManagementTeamRolesByUsername(
    d2Events: D2TrackerEvent[],
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): Record<string, IncidentManagementTeamRole[]> {
    return d2Events.reduce(
        (acc: Record<string, IncidentManagementTeamRole[]>, event: D2TrackerEvent) => {
            const teamMemberAssignedUsername = getValueById(
                event.dataValues,
                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.teamMemberAssigned
            );

            if (!teamMemberAssignedUsername) {
                return acc;
            }

            const teamRoles = incidentManagementTeamProgramStageDataElements.reduce(
                (accTeamRoles: IncidentManagementTeamRole[], programStage) => {
                    const roleId = programStage.dataElement.id;
                    const reportsToUsername = getValueById(
                        event.dataValues,
                        RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.reportsToUsername
                    );

                    if (getValueById(event.dataValues, roleId) === "true") {
                        return [
                            ...accTeamRoles,
                            {
                                id: event.event,
                                roleId: roleId,
                                reportsToUsername: reportsToUsername,
                            },
                        ];
                    }

                    return accTeamRoles;
                },
                []
            );

            if (acc[teamMemberAssignedUsername]) {
                return {
                    ...acc,
                    [teamMemberAssignedUsername]: [
                        ...(acc[teamMemberAssignedUsername] || []),
                        ...teamRoles,
                    ],
                };
            } else {
                return {
                    ...acc,
                    [teamMemberAssignedUsername]: teamRoles,
                };
            }
        },
        {}
    );
}
