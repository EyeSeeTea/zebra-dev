import {
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { GetValue } from "../../../utils/ts-utils";

export const RTSL_ZEBRA_PROGRAM_ID = "qkOTdxkte8V";
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

export type KeyCode = (typeof DiseaseOutbreakCodes)[keyof typeof DiseaseOutbreakCodes];

export function isStringInDiseaseOutbreakCodes(code: string): code is KeyCode {
    return Object.values(DiseaseOutbreakCodes).includes(code as KeyCode);
}

export function isHazardType(hazardType: string): hazardType is HazardType {
    return [
        "Biological:Animal",
        "Biological:Human",
        "Chemical",
        "Environmental",
        "Unknown",
    ].includes(hazardType);
}

export function getValueFromDiseaseOutbreak(
    key: KeyCode,
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs
): string {
    switch (key) {
        case "RTSL_ZEB_TEA_EVENT_id":
            return diseaseOutbreak.eventId.toString();
        case "RTSL_ZEB_TEA_EVENT_NAME":
            return diseaseOutbreak.name;
        case "RTSL_ZEB_TEA_HAZARD_TYPE":
            switch (diseaseOutbreak.hazardType) {
                case "Biological:Animal":
                    return "BIOLOGICAL_ANIMAL";
                case "Biological:Human":
                    return "BIOLOGICAL_HUMAN";
                case "Chemical":
                    return "CHEMICAL";
                case "Environmental":
                    return "ENVIRONMENTAL";
                case "Unknown":
                    return "UNKNOWN";
            }
            break;
        case "RTSL_ZEB_TEA_MAIN_SYNDROME":
            return diseaseOutbreak.mainSyndromeCode;
        case "RTSL_ZEB_TEA_SUSPECTED_DISEASE":
            return diseaseOutbreak.suspectedDiseaseCode;
        case "RTSL_ZEB_TEA_NOTIFICATION_SOURCE":
            return diseaseOutbreak.notificationSourceCode;
        case "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES":
            return getOUTextFromList(diseaseOutbreak.areasAffectedProvinceIds);
        case "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS":
            return getOUTextFromList(diseaseOutbreak.areasAffectedDistrictIds);
        case "RTSL_ZEB_TEA_INCIDENT_STATUS":
            return diseaseOutbreak.incidentStatus;
        case "RTSL_ZEB_TEA_DATE_EMERGED":
            return diseaseOutbreak.emerged.date.toISOString();
        case "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE":
            return diseaseOutbreak.emerged.narrative;
        case "RTSL_ZEB_TEA_DATE_DETECTED":
            return diseaseOutbreak.detected.date.toISOString();
        case "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE":
            return diseaseOutbreak.detected.narrative;
        case "RTSL_ZEB_TEA_DATE_NOTIFIED":
            return diseaseOutbreak.notified.date.toISOString();
        case "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE":
            return diseaseOutbreak.notified.narrative;
        case "RTSL_ZEB_TEA_INITIATE_INVESTIGATION":
            return diseaseOutbreak.earlyResponseActions.initiateInvestigation.toISOString();
        case "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS":
            return diseaseOutbreak.earlyResponseActions.conductEpidemiologicalAnalysis.toISOString();
        case "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION":
            return diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.na ? "true" : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE1":
            return (
                diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.date?.toISOString() ??
                ""
            );
        case "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT":
            return diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.na ? "true" : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE2":
            return (
                diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.date?.toISOString() ??
                ""
            );
        case "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH":
            return diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.na
                ? "true"
                : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE3":
            return (
                diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.date?.toISOString() ??
                ""
            );
        case "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION":
            return diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.na ? "true" : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE4":
            return (
                diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.date?.toISOString() ??
                ""
            );
        case "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM":
            return diseaseOutbreak.earlyResponseActions.establishCoordination.toISOString();
        case "RTSL_ZEB_TEA_RESPONSE_NARRATIVE":
            return diseaseOutbreak.earlyResponseActions.responseNarrative;
        case "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER":
            return diseaseOutbreak.incidentManagerName;
        case "RTSL_ZEB_TEA_NOTES":
            return diseaseOutbreak.notes ?? "";
    }
}

function getOUTextFromList(OUs: string[]): string {
    return OUs[0] ?? ""; //TO DO : Handle multiple provinces/districts once metadata change is done
}
