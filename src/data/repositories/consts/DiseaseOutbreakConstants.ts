import {
    CasesDataSource,
    DiseaseOutbreakEventBaseAttrs,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { GetValue } from "../../../utils/ts-utils";

export const RTSL_ZEBRA_PROGRAM_ID = "qkOTdxkte8V";
export const RTSL_ZEBRA_ORG_UNIT_ID = "PS5JpkoHHio";
export const RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID = "lIzNjLOUAKA";
export const RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID = "swh2ZukmkDk";
export const RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID = "jBjvgjSgf9d";
export const RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_PROGRAM_STAGE_ID = "Ltmf2awDAkS";
export const RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_CUSTOM_PROGRAM_STAGE_ID = "LpB1gNXEbEV";
export const RTSL_ZEBRA_INCIDENT_ACTION_PLAN_PROGRAM_STAGE_ID = "FwUxJTqq35X";
export const RTSL_ZEBRA_INCIDENT_RESPONSE_ACTION_PROGRAM_STAGE_ID = "bxy7o3UOY6T";
export const RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID = "DwEOpUBGgOp";

export const RTSL_ZEBRA_ALERTS_PROGRAM_ID = "MQtbs8UkBxy";
export const RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID = "Pq1drzz2HJk";
export const RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID = "agsVaIpit4S";
export const RTSL_ZEBRA_ALERTS_VERIFICATION_STATUS_ID = "HvgldgBK8Th";
export const RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID = "KeUbzfFQYCX";

export const casesDataSourceMap: Record<string, CasesDataSource> = {
    RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
    RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF,
};

export const diseaseOutbreakCodes = {
    name: "RTSL_ZEB_TEA_EVENT_NAME",
    mainSyndrome: "RTSL_ZEB_TEA_MAIN_SYNDROME",
    suspectedDisease: "RTSL_ZEB_TEA_SUSPECTED_DISEASE",
    notificationSource: "RTSL_ZEB_TEA_NOTIFICATION_SOURCE",
    areasAffectedProvinces: "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES",
    areasAffectedDistricts: "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS",
    incidentManager: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    notes: "RTSL_ZEB_TEA_NOTES",
    casesDataSource: "RTSL_ZEB_TEA_CASE_DATA_SOURCE",
} as const;

export type DiseaseOutbreakCode = GetValue<typeof diseaseOutbreakCodes>;

export type DiseaseOutbreakKeyCode =
    (typeof diseaseOutbreakCodes)[keyof typeof diseaseOutbreakCodes];

export function isStringInDiseaseOutbreakCodes(code: string): code is DiseaseOutbreakKeyCode {
    return (Object.values(diseaseOutbreakCodes) as string[]).includes(code);
}

export function getValueFromDiseaseOutbreak(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs
): Record<DiseaseOutbreakCode, string> {
    return {
        RTSL_ZEB_TEA_EVENT_NAME: diseaseOutbreak.name,
        RTSL_ZEB_TEA_MAIN_SYNDROME: diseaseOutbreak.mainSyndromeCode ?? "",
        RTSL_ZEB_TEA_SUSPECTED_DISEASE: diseaseOutbreak.suspectedDiseaseCode ?? "",
        RTSL_ZEB_TEA_NOTIFICATION_SOURCE: diseaseOutbreak.notificationSourceCode,
        RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES: "",
        RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS: "",
        RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER: diseaseOutbreak.incidentManagerName,
        RTSL_ZEB_TEA_NOTES: diseaseOutbreak.notes ?? "",
        RTSL_ZEB_TEA_CASE_DATA_SOURCE: diseaseOutbreak.casesDataSource,
    };
}
