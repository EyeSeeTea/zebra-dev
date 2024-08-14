import {
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { GetValue, Maybe } from "../../../utils/ts-utils";
import { getDateAsIsoString } from "../utils/DateTimeHelper";

export const RTSL_ZEBRA_PROGRAM_ID = "qkOTdxkte8V";
export const RTSL_ZEBRA_ALERTS_PROGRAM_ID = "MQtbs8UkBxy";
export const RTSL_ZEBRA_ORG_UNIT_ID = "PS5JpkoHHio";
export const RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID = "lIzNjLOUAKA";

export const hazardTypeCodeMap: Record<HazardType, string> = {
    "Biological:Human": "BIOLOGICAL_HUMAN",
    "Biological:Animal": "BIOLOGICAL_ANIMAL",
    Chemical: "CHEMICAL",
    Environmental: "ENVIRONMENTAL",
    Unknown: "UNKNOWN",
};

export const diseaseOutbreakCodes = {
    name: "RTSL_ZEB_TEA_EVENT_NAME",
    dataSource: "RTSL_ZEB_TEA_DATA_SOURCE",
    hazardType: "RTSL_ZEB_TEA_HAZARD_TYPE",
    mainSyndrome: "RTSL_ZEB_TEA_MAIN_SYNDROME",
    suspectedDisease: "RTSL_ZEB_TEA_SUSPECTED_DISEASE",
    notificationSource: "RTSL_ZEB_TEA_NOTIFICATION_SOURCE",
    areasAffectedProvinces: "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES",
    areasAffectedDistricts: "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS",
    incidentStatus: "RTSL_ZEB_TEA_INCIDENT_STATUS",
    emergedDate: "RTSL_ZEB_TEA_DATE_EMERGED",
    emergedNarrative: "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE",
    detectedDate: "RTSL_ZEB_TEA_DATE_DETECTED",
    detectedNarrative: "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE",
    notifiedDate: "RTSL_ZEB_TEA_DATE_NOTIFIED",
    notifiedNarrative: "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE",
    initiateInvestigation: "RTSL_ZEB_TEA_INITIATE_INVESTIGATION",
    conductEpidemiologicalAnalysis: "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS",
    laboratoryConfirmationNA: "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION_NA",
    laboratoryConfirmationDate: "RTSL_ZEB_TEA_SPECIFY_DATE1",
    appropriateCaseManagementNA: "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT_NA",
    appropriateCaseManagementDate: "RTSL_ZEB_TEA_SPECIFY_DATE2",
    initiatePublicHealthCounterMeasuresNA: "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH_NA",
    initiatePublicHealthCounterMeasuresDate: "RTSL_ZEB_TEA_SPECIFY_DATE3",
    initiateRiskCommunicationNA: "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION_NA",
    initiateRiskCommunicationDate: "RTSL_ZEB_TEA_SPECIFY_DATE4",
    establishCoordination: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
    responseNarrative: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
    incidentManager: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    notes: "RTSL_ZEB_TEA_NOTES",
} as const;

export type DiseaseOutbreakCode = GetValue<typeof diseaseOutbreakCodes>;

export type KeyCode = (typeof diseaseOutbreakCodes)[keyof typeof diseaseOutbreakCodes];

export function isStringInDiseaseOutbreakCodes(code: string): code is KeyCode {
    return (Object.values(diseaseOutbreakCodes) as string[]).includes(code);
}

export function getHazardTypeValue(hazardType: string): HazardType {
    const hazardTypeString = Object.keys(hazardTypeCodeMap).find(
        key => hazardTypeCodeMap[key as HazardType] === hazardType
    );
    return hazardTypeString ? (hazardTypeString as HazardType) : "Unknown";
}

export function getValueFromDiseaseOutbreak(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs
): Record<DiseaseOutbreakCode, string> {
    return {
        RTSL_ZEB_TEA_EVENT_NAME: diseaseOutbreak.name,
        RTSL_ZEB_TEA_DATA_SOURCE: diseaseOutbreak.dataSourceCode,
        RTSL_ZEB_TEA_HAZARD_TYPE: hazardTypeCodeMap[diseaseOutbreak.hazardType],
        RTSL_ZEB_TEA_MAIN_SYNDROME: diseaseOutbreak.mainSyndromeCode,
        RTSL_ZEB_TEA_SUSPECTED_DISEASE: diseaseOutbreak.suspectedDiseaseCode,
        RTSL_ZEB_TEA_NOTIFICATION_SOURCE: diseaseOutbreak.notificationSourceCode,
        RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES: getOUTextFromList(
            diseaseOutbreak.areasAffectedProvinceIds
        ),
        RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS: getOUTextFromList(
            diseaseOutbreak.areasAffectedDistrictIds
        ),
        RTSL_ZEB_TEA_INCIDENT_STATUS: diseaseOutbreak.incidentStatus,
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
        RTSL_ZEB_TEA_LABORATORY_CONFIRMATION_NA: getNaValue(
            diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.na
        ),
        RTSL_ZEB_TEA_SPECIFY_DATE1: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.date
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
        RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM: getDateAsIsoString(
            diseaseOutbreak.earlyResponseActions.establishCoordination
        ),
        RTSL_ZEB_TEA_RESPONSE_NARRATIVE: diseaseOutbreak.earlyResponseActions.responseNarrative,
        RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER: diseaseOutbreak.incidentManagerName,
        RTSL_ZEB_TEA_NOTES: diseaseOutbreak.notes ?? "",
    };
}

export function getHazardTypeByCode(hazardTypeCode: string): HazardType {
    switch (hazardTypeCode) {
        case "BIOLOGICAL_ANIMAL":
            return "Biological:Animal";
        case "BIOLOGICAL_HUMAN":
            return "Biological:Human";
        case "CHEMICAL":
            return "Chemical";
        case "ENVIRONMENTAL":
            return "Environmental";
        case "UNKNOWN":
        default:
            return "Unknown";
    }
}

function getOUTextFromList(OUs: string[]): string {
    return OUs[0] ?? ""; //TO DO : Handle multiple provinces/districts once metadata change is done
}

function getNaValue(naValue: Maybe<boolean>): string {
    return naValue ? "true" : "";
}
