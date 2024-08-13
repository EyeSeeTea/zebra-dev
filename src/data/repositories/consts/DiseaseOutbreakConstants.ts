import {
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { GetValue } from "../../../utils/ts-utils";

export const RTSL_ZEBRA_PROGRAM_ID = "qkOTdxkte8V";
export const RTSL_ZEBRA_ALERTS_PROGRAM_ID = "MQtbs8UkBxy";
export const RTSL_ZEBRA_ORG_UNIT_ID = "PS5JpkoHHio";
export const RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID = "lIzNjLOUAKA";

export const DiseaseOutbreakCodes = {
    eventId: "RTSL_ZEB_TEA_EVENT_id",
    name: "RTSL_ZEB_TEA_EVENT_NAME",
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
    laboratoryConfirmationNA: "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION",
    laboratoryConfirmationDate: "RTSL_ZEB_TEA_SPECIFY_DATE1",
    appropriateCaseManagementNA: "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT",
    appropriateCaseManagementDate: "RTSL_ZEB_TEA_SPECIFY_DATE2",
    initiatePublicHealthCounterMeasuresNA: "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH",
    initiatePublicHealthCounterMeasuresDate: "RTSL_ZEB_TEA_SPECIFY_DATE3",
    initiateRiskCommunicationNA: "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION",
    initiateRiskCommunicationDate: "RTSL_ZEB_TEA_SPECIFY_DATE4",
    establishCoordination: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
    responseNarrative: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
    incidentManager: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    notes: "RTSL_ZEB_TEA_NOTES",
} as const;

export type DiseaseOutbreakCode = GetValue<typeof DiseaseOutbreakCodes>;

export type KeyCode = (typeof DiseaseOutbreakCodes)[keyof typeof DiseaseOutbreakCodes];

export function isStringInDiseaseOutbreakCodes(code: string): code is KeyCode {
    return Object.values(DiseaseOutbreakCodes).includes(code as KeyCode);
}

export function isHazardType(hazardType: string): hazardType is HazardType {
    return [
        "Biological:Animal",
        "Biological:Human",
        "Biological:HumanAndAnimal",
        "Chemical",
        "Environmental",
        "Unknown",
    ].includes(hazardType);
}

export function getValueFromDiseaseOutbreak(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs
): Record<DiseaseOutbreakCode, string> {
    return {
        RTSL_ZEB_TEA_EVENT_id: diseaseOutbreak.eventId?.toString() || "",
        RTSL_ZEB_TEA_EVENT_NAME: diseaseOutbreak.name,
        RTSL_ZEB_TEA_HAZARD_TYPE: getHazardTypeCode(diseaseOutbreak.hazardType),
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
        RTSL_ZEB_TEA_DATE_EMERGED: diseaseOutbreak.emerged.date.toISOString(),
        RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE: diseaseOutbreak.emerged.narrative,
        RTSL_ZEB_TEA_DATE_DETECTED: diseaseOutbreak.detected.date.toISOString(),
        RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE: diseaseOutbreak.detected.narrative,
        RTSL_ZEB_TEA_DATE_NOTIFIED: diseaseOutbreak.notified.date.toISOString(),
        RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE: diseaseOutbreak.notified.narrative,
        RTSL_ZEB_TEA_INITIATE_INVESTIGATION:
            diseaseOutbreak.earlyResponseActions.initiateInvestigation.toISOString(),
        RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS:
            diseaseOutbreak.earlyResponseActions.conductEpidemiologicalAnalysis.toISOString(),
        RTSL_ZEB_TEA_LABORATORY_CONFIRMATION: diseaseOutbreak.earlyResponseActions
            .laboratoryConfirmation.na
            ? ""
            : "true",
        RTSL_ZEB_TEA_SPECIFY_DATE1:
            diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.date?.toISOString() ?? "",
        RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT: diseaseOutbreak.earlyResponseActions
            .appropriateCaseManagement.na
            ? ""
            : "true",
        RTSL_ZEB_TEA_SPECIFY_DATE2:
            diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.date?.toISOString() ??
            "",
        RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH: diseaseOutbreak.earlyResponseActions
            .initiatePublicHealthCounterMeasures.na
            ? ""
            : "true",
        RTSL_ZEB_TEA_SPECIFY_DATE3:
            diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.date?.toISOString() ??
            "",
        RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION: diseaseOutbreak.earlyResponseActions
            .initiateRiskCommunication.na
            ? ""
            : "true",
        RTSL_ZEB_TEA_SPECIFY_DATE4:
            diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.date?.toISOString() ??
            "",
        RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM:
            diseaseOutbreak.earlyResponseActions.establishCoordination.toISOString(),
        RTSL_ZEB_TEA_RESPONSE_NARRATIVE: diseaseOutbreak.earlyResponseActions.responseNarrative,
        RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER: diseaseOutbreak.incidentManagerName,
        RTSL_ZEB_TEA_NOTES: diseaseOutbreak.notes ?? "",
    };
}

function getHazardTypeCode(hazardType: HazardType): string {
    switch (hazardType) {
        case "Biological:Animal":
            return "BIOLOGICAL_ANIMAL";
        case "Biological:Human":
            return "BIOLOGICAL_HUMAN";
        case "Biological:HumanAndAnimal":
            return "BIOLOGICAL_HUM_ANM";
        case "Chemical":
            return "CHEMICAL";
        case "Environmental":
            return "ENVIRONMENTAL";
        case "Unknown":
            return "UNKNOWN";
    }
}

export function getHazardTypeByCode(hazardTypeCode: string): HazardType {
    switch (hazardTypeCode) {
        case "BIOLOGICAL_ANIMAL":
            return "Biological:Animal";
        case "BIOLOGICAL_HUMAN":
            return "Biological:Human";
        case "BIOLOGICAL_HUM_ANM":
            return "Biological:HumanAndAnimal";
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
