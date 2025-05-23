import {
    CasesDataSource,
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import _c from "../../../domain/entities/generic/Collection";
import { GetValue, Maybe } from "../../../utils/ts-utils";
import { getDateAsIsoString } from "../utils/DateTimeHelper";

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
export const RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID = "ydsfY6zyvt7";
export const RTSL_ZEBRA_ALERTS_VERIFICATION_STATUS_ID = "HvgldgBK8Th";
export const RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID = "KeUbzfFQYCX";

export const casesDataSourceMap: Record<string, CasesDataSource> = {
    RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
    RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF,
};

export const dataSourceMap: Record<string, DataSource> = {
    ND1: DataSource.ND1,
    ND2: DataSource.ND2,
};

export const RTSL_ZEB_TEA_SUSPECTED_DISEASE_ID = "jLvbkuvPdZ6";

export const diseaseOutbreakCodes = {
    name: "RTSL_ZEB_TEA_EVENT_NAME",
    mainSyndrome: "RTSL_ZEB_TEA_MAIN_SYNDROME",
    suspectedDisease: "RTSL_ZEB_TEA_SUSPECTED_DISEASE",
    notificationSource: "RTSL_ZEB_TEA_NOTIFICATION_SOURCE",
    areasAffectedProvinces: "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES",
    areasAffectedDistricts: "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS",
    emergedDate: "RTSL_ZEB_TEA_DATE_EMERGED",
    emergedNarrative: "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE",
    detectedDate: "RTSL_ZEB_TEA_DATE_DETECTED",
    detectedNarrative: "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE",
    notifiedDate: "RTSL_ZEB_TEA_DATE_NOTIFIED",
    notifiedNarrative: "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE",
    initiateInvestigation: "RTSL_ZEB_TEA_INITIATE_INVESTIGATION",
    conductEpidemiologicalAnalysis: "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS",
    laboratoryConfirmation: "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION_NA",
    appropriateCaseManagementNA: "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT_NA",
    appropriateCaseManagementDate: "RTSL_ZEB_TEA_SPECIFY_DATE2",
    initiatePublicHealthCounterMeasuresNA: "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH_NA",
    initiatePublicHealthCounterMeasuresDate: "RTSL_ZEB_TEA_SPECIFY_DATE3",
    initiateRiskCommunicationNA: "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION_NA",
    initiateRiskCommunicationDate: "RTSL_ZEB_TEA_SPECIFY_DATE4",
    earliestRespondDate: "RTSL_ZEB_TEA_EARLIEST_RESPOND_DATE",
    establishCoordinationNA: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
    establishCoordinationDate: "RTSL_ZEB_TEA_SPECIFY_DATE5",
    responseNarrative: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
    incidentManager: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    notes: "RTSL_ZEB_TEA_NOTES",
    casesDataSource: "RTSL_ZEB_TEA_CASE_DATA_SOURCE",
    dataSource: "RTSL_ZEB_TEA_DEFAULT_DATA_SOURCE",
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
    //Set Earliest Respond Date as the earliest of all early response action dates.
    const responseActionDates: number[] = _c([
        diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.date?.getTime(),
        diseaseOutbreak.earlyResponseActions.conductEpidemiologicalAnalysis?.getTime(),
        diseaseOutbreak.earlyResponseActions.initiateInvestigation?.getTime(),
        diseaseOutbreak.earlyResponseActions.establishCoordination.date?.getTime(),
        diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.date?.getTime(),
        diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.date?.getTime(),
        diseaseOutbreak.earlyResponseActions.laboratoryConfirmation?.getTime(),
    ])
        .compact()
        .value();

    const earliestRespondDate: Date = new Date(Math.min(...responseActionDates));
    return {
        RTSL_ZEB_TEA_EVENT_NAME: diseaseOutbreak.name,
        RTSL_ZEB_TEA_MAIN_SYNDROME: diseaseOutbreak.mainSyndromeCode ?? "",
        RTSL_ZEB_TEA_SUSPECTED_DISEASE: diseaseOutbreak.suspectedDiseaseCode ?? "",
        RTSL_ZEB_TEA_NOTIFICATION_SOURCE: diseaseOutbreak.notificationSourceCode,
        RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES: "",
        RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS: "",
        RTSL_ZEB_TEA_DATE_EMERGED: getDateAsIsoString(diseaseOutbreak.emerged.date),
        RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE: diseaseOutbreak.emerged.narrative,
        RTSL_ZEB_TEA_DATE_DETECTED: getDateAsIsoString(diseaseOutbreak.detected.date),
        RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE: diseaseOutbreak.detected.narrative,
        RTSL_ZEB_TEA_DATE_NOTIFIED: getDateAsIsoString(diseaseOutbreak.notified.date),
        RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE: diseaseOutbreak.notified.narrative,
        RTSL_ZEB_TEA_INITIATE_INVESTIGATION: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.initiateInvestigation
        ),
        RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.conductEpidemiologicalAnalysis
        ),
        RTSL_ZEB_TEA_LABORATORY_CONFIRMATION_NA: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.laboratoryConfirmation
        ),
        RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT_NA: getNaValue(
            diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.na
        ),

        RTSL_ZEB_TEA_SPECIFY_DATE2: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.date
        ),
        RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH_NA: getNaValue(
            diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.na
        ),

        RTSL_ZEB_TEA_SPECIFY_DATE3: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.date
        ),
        RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION_NA: getNaValue(
            diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.na
        ),
        RTSL_ZEB_TEA_SPECIFY_DATE4: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.date
        ),
        RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM: getNaValue(
            diseaseOutbreak.earlyResponseActions.establishCoordination.na
        ),
        RTSL_ZEB_TEA_SPECIFY_DATE5: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.establishCoordination.date
        ),
        RTSL_ZEB_TEA_EARLIEST_RESPOND_DATE: getDateAsIsoString(earliestRespondDate),
        RTSL_ZEB_TEA_RESPONSE_NARRATIVE: diseaseOutbreak.earlyResponseActions.responseNarrative,
        RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER: diseaseOutbreak.incidentManagerName,
        RTSL_ZEB_TEA_NOTES: diseaseOutbreak.notes ?? "",
        RTSL_ZEB_TEA_CASE_DATA_SOURCE: diseaseOutbreak.casesDataSource,
        RTSL_ZEB_TEA_DEFAULT_DATA_SOURCE: diseaseOutbreak.dataSource,
    };
}

function getNaValue(naValue: Maybe<boolean>): string {
    return naValue ? "true" : "";
}
