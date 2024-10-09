import { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";

import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { getPopulatedDataElement, getValueById } from "./helpers";
import {
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "../consts/DiseaseOutbreakConstants";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { Maybe } from "../../../utils/ts-utils";
import { D2DataElement } from "../IncidentManagementTeamD2Repository";
import _c from "../../../domain/entities/generic/Collection";
import { Id } from "../../../domain/entities/Ref";
import { SelectedPick } from "@eyeseetea/d2-api/api";
import { D2DataElementSchema } from "@eyeseetea/d2-api/2.36";
import {
    IncidentManagementTeamBuilderCodes,
    isStringInIncidentManagementTeamBuilderCodes,
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS,
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS,
} from "../consts/IncidentManagementTeamBuilderConstants";

export function mapD2EventsToIncidentManagementTeam(
    events: D2TrackerEvent[],
    dataElementRoles: D2DataElement[],
    teamMembers: TeamMember[]
): Maybe<IncidentManagementTeam> {
    const teamHierarchy: TeamMember[] = teamMembers.reduce(
        (acc: TeamMember[], teamMember: TeamMember) => {
            const memberRoleEvents = events.filter(event => {
                const teamMemberAssignedUsername = getValueById(
                    event.dataValues,
                    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS.teamMemberAssigned
                );
                return teamMemberAssignedUsername === teamMember.username;
            });

            if (memberRoleEvents.length === 0) {
                return acc;
            } else {
                const teamRoles = getTeamMemberIncidentManagementTeamRoles(
                    teamMember,
                    memberRoleEvents,
                    dataElementRoles
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

export function getTeamMemberIncidentManagementTeamRoles(
    teamMemberAssigned: TeamMember,
    events: D2TrackerEvent[],
    dataElementRoles: D2DataElement[]
): TeamRole[] {
    return events.reduce((acc: TeamRole[], event: D2TrackerEvent) => {
        if (
            teamMemberAssigned.username ===
            getValueById(
                event.dataValues,
                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS.teamMemberAssigned
            )
        ) {
            const teamRole = getTeamRole(event.event, event.dataValues, dataElementRoles);
            return teamRole ? [...acc, teamRole] : acc;
        }
        return acc;
    }, []);
}

function getTeamRole(
    eventId: Id,
    dataValues: DataValue[],
    dataElementRoles: D2DataElement[]
): Maybe<TeamRole> {
    const roleIds = Object.values(RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS);

    const selectedRoleId = roleIds.find(roleId => {
        const role = getValueById(dataValues, roleId);
        return role === "true";
    });

    const roleDataElement = dataElementRoles.find(dataElement => dataElement.id === selectedRoleId);

    const reportsToUsername = getValueById(
        dataValues,
        RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS.reportsToUsername
    );

    if (selectedRoleId && roleDataElement) {
        return {
            id: eventId,
            roleId: selectedRoleId,
            name: roleDataElement?.name,
            reportsToUsername: reportsToUsername,
        };
    }
}

type D2ProgramStageDataElementsMetadata = {
    dataElement: SelectedPick<
        D2DataElementSchema,
        {
            id: true;
            valueType: true;
            code: true;
        }
    >;
};

export function mapIncidentManagementTeamMemberToD2Event(
    teamMemberRole: TeamRole,
    incidentManagementTeamMember: TeamMember,
    teiId: Id,
    enrollmentId: Id,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent {
    const dataElementValues: Record<IncidentManagementTeamBuilderCodes, string> =
        getValueFromIncidentManagementTeamMember(
            incidentManagementTeamMember.username,
            teamMemberRole
        );

    const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
        if (!isStringInIncidentManagementTeamBuilderCodes(programStage.dataElement.code)) {
            throw new Error("DataElement code not found in IncidentManagementTeamBuilderCodes");
        }
        const typedCode: IncidentManagementTeamBuilderCodes = programStage.dataElement.code;
        return getPopulatedDataElement(programStage.dataElement.id, dataElementValues[typedCode]);
    });

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

export function getValueFromIncidentManagementTeamMember(
    incidentManagementTeamMemberUsername: string,
    teamRoleAssigned: TeamRole
): Record<IncidentManagementTeamBuilderCodes, string> {
    const checkRoleSelected = (roleId: string): boolean =>
        (teamRoleAssigned?.roleId || "") === roleId;

    return {
        RTSL_ZEB_DET_IMB_TMA: incidentManagementTeamMemberUsername,
        RTSL_ZEB_DET_IMB_REPORTS: teamRoleAssigned?.reportsToUsername ?? "",
        RTSL_ZEB_DET_IMB_INCIDENT_MANAGER: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole
        )
            ? "true"
            : "",
        RTSL_ZEB_DET_IMB_CASE_MANAGMENT: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.caseManagementRole
        )
            ? "true"
            : "",
        RTSL_ZEB_DET_IMB_IPC_LEAD: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.ipcUnitLeadRole
        )
            ? "true"
            : "",
        RTSL_ZEB_DET_IMB_LAB_LEAD: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.labUnitLeadRole
        )
            ? "true"
            : "",
        RTSL_ZEB_DET_IMB_OPERATIONAL_LEAD: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.operationalSectionLeadRole
        )
            ? "true"
            : "",
        RTSL_ZEB_DET_IMB_SURVEILLANCE_LEAD: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.surveillanceUnitLeadRole
        )
            ? "true"
            : "",
        RTSL_ZEB_DET_IMB_VACCINE_UNIT: checkRoleSelected(
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.vaccineUnitRole
        )
            ? "true"
            : "",
    };
}
