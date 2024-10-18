import { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";

import _c from "../../../domain/entities/generic/Collection";
import { Maybe } from "../../../utils/ts-utils";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { getPopulatedDataElement, getValueById } from "./helpers";
import {
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "../consts/DiseaseOutbreakConstants";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import {
    incidentManagementTeamBuilderCodesWithoutRoles,
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES,
} from "../consts/IncidentManagementTeamBuilderConstants";
import { D2ProgramStageDataElementsMetadata } from "./MetadataHelper";

export function mapD2EventsToIncidentManagementTeam(
    diseaseOutbreakId: Id,
    d2Events: D2TrackerEvent[],
    teamMembers: TeamMember[],
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): IncidentManagementTeam {
    const teamHierarchy: TeamMember[] = teamMembers.reduce(
        (acc: TeamMember[], teamMember: TeamMember) => {
            const memberRoleEvents = d2Events.filter(event => {
                const teamMemberAssignedUsername = getValueById(
                    event.dataValues,
                    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.teamMemberAssigned
                );
                return teamMemberAssignedUsername === teamMember.username;
            });

            if (memberRoleEvents.length === 0) {
                return acc;
            } else {
                const teamRoles = getTeamMemberIncidentManagementTeamRoles(
                    diseaseOutbreakId,
                    teamMember,
                    memberRoleEvents,
                    incidentManagementTeamProgramStageDataElements
                );

                return teamRoles.length === 0
                    ? acc
                    : [...acc, new TeamMember({ ...teamMember, teamRoles: teamRoles })];
            }
        },
        []
    );

    return new IncidentManagementTeam({
        teamHierarchy: teamHierarchy,
    });
}

function getTeamMemberIncidentManagementTeamRoles(
    diseaseOutbreakId: Id,
    teamMemberAssigned: TeamMember,
    events: D2TrackerEvent[],
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): TeamRole[] {
    return events.reduce((acc: TeamRole[], event: D2TrackerEvent) => {
        if (
            teamMemberAssigned.username ===
            getValueById(
                event.dataValues,
                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.teamMemberAssigned
            )
        ) {
            const teamRole = getTeamRole(
                diseaseOutbreakId,
                event.event,
                event.dataValues,
                incidentManagementTeamProgramStageDataElements
            );

            return teamRole ? [...acc, teamRole] : acc;
        }
        return acc;
    }, []);
}

function getTeamRole(
    diseaseOutbreakId: Id,
    eventId: Id,
    dataValues: DataValue[],
    incidentManagementTeamProgramStageDataElements: D2ProgramStageDataElementsMetadata[]
): Maybe<TeamRole> {
    const selectedRoleId = incidentManagementTeamProgramStageDataElements.find(programStage => {
        const role = getValueById(dataValues, programStage.dataElement.id);
        return role === "true";
    })?.dataElement.id;

    const roleSelected = incidentManagementTeamProgramStageDataElements.find(
        programStage => programStage.dataElement.id === selectedRoleId
    );

    const reportsToUsername = getValueById(
        dataValues,
        RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.reportsToUsername
    );

    if (selectedRoleId && roleSelected) {
        return {
            id: eventId,
            diseaseOutbreakId: diseaseOutbreakId,
            roleId: selectedRoleId,
            name: roleSelected?.dataElement.name,
            reportsToUsername: reportsToUsername,
        };
    }
}

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
