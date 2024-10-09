import { GetValue } from "../../../utils/ts-utils";

export const RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS = {
    incidentManagerRole: "fnZ7EcG5CCV",
    caseManagementRole: "Ci2TwQIVR2x",
    ipcUnitLeadRole: "NARFizS9nsk",
    labUnitLeadRole: "SsXKTkPrJt9",
    operationalSectionLeadRole: "lO197QfYLBc",
    surveillanceUnitLeadRole: "EnmRCZYjSV6",
    vaccineUnitRole: "RMqPVOnz8ja",
} as const;

export const RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS = {
    teamMemberAssigned: "iodfsSspCov",
    reportsToUsername: "TFIPHJyXN6H",
    incidentManagerRole: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole,
    caseManagementRole: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.caseManagementRole,
    ipcUnitLeadRole: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.ipcUnitLeadRole,
    labUnitLeadRole: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.labUnitLeadRole,
    operationalSectionLeadRole:
        RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.operationalSectionLeadRole,
    surveillanceUnitLeadRole:
        RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.surveillanceUnitLeadRole,
    vaccineUnitRole: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.vaccineUnitRole,
} as const;

export const incidentManagementTeamBuilderCodes = {
    teamMemberAssigned: "RTSL_ZEB_DET_IMB_TMA",
    reportsToUsername: "RTSL_ZEB_DET_IMB_REPORTS",
    incidentManagerRole: "RTSL_ZEB_DET_IMB_INCIDENT_MANAGER",
    caseManagementRole: "RTSL_ZEB_DET_IMB_CASE_MANAGMENT",
    ipcUnitLeadRole: "RTSL_ZEB_DET_IMB_IPC_LEAD",
    labUnitLeadRole: "RTSL_ZEB_DET_IMB_LAB_LEAD",
    operationalSectionLeadRole: "RTSL_ZEB_DET_IMB_OPERATIONAL_LEAD",
    surveillanceUnitLeadRole: "RTSL_ZEB_DET_IMB_SURVEILLANCE_LEAD",
    vaccineUnitRole: "RTSL_ZEB_DET_IMB_VACCINE_UNIT",
} as const;

export type IncidentManagementTeamBuilderCodes = GetValue<
    typeof incidentManagementTeamBuilderCodes
>;

export function isStringInIncidentManagementTeamBuilderCodes(
    code: string
): code is IncidentManagementTeamBuilderCodes {
    return (Object.values(incidentManagementTeamBuilderCodes) as string[]).includes(code);
}
