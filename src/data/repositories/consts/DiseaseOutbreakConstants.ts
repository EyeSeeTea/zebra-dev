import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    NationalIncidentStatus,
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

export const RTSL_ZEBRA_ALERTS_PROGRAM_ID = "MQtbs8UkBxy";
export const RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID = "Pq1drzz2HJk";
export const RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID = "agsVaIpit4S";
export const RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID = "ydsfY6zyvt7";
export const RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID = "DzGqKzjhIsz";

export const hazardTypeCodeMap: Record<HazardType, string> = {
    "Biological:Human": "RTSL_ZEB_OS_HAZARD_TYPE_BIOLOGICAL_HUMAN",
    "Biological:Animal": "RTSL_ZEB_OS_HAZARD_TYPE_BIOLOGICAL_ANIMAL",
    "Biological:HumanAndAnimal": "RTSL_ZEB_OS_HAZARD_TYPE_BIOLOGICAL_HUM_ANM",
    Chemical: "RTSL_ZEB_OS_HAZARD_TYPE_CHEMICAL",
    Environmental: "RTSL_ZEB_OS_HAZARD_TYPE_ENVIRONMENTAL",
    Unknown: "RTSL_ZEB_OS_HAZARD_TYPE_UNKNOWN",
};

export const incidentStatusMap: Record<string, NationalIncidentStatus> = {
    RTSL_ZEB_OS_INCIDENT_STATUS_WATCH: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH,
    RTSL_ZEB_OS_INCIDENT_STATUS_ALERT: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_ALERT,
    RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND,
    RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED,
    RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED:
        NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED,
};

export const dataSourceMap: Record<string, DataSource> = {
    RTSL_ZEB_OS_DATA_SOURCE_IBS: DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
    RTSL_ZEB_OS_DATA_SOURCE_EBS: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
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
    earliestRespondDate: "RTSL_ZEB_TEA_EARLIEST_RESPOND_DATE",
    establishCoordination: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
    responseNarrative: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
    incidentManager: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    notes: "RTSL_ZEB_TEA_NOTES",
    caseDataSource: "RTSL_ZEB_TEA_CASE_DATA_SOURCE",
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
        diseaseOutbreak.earlyResponseActions.conductEpidemiologicalAnalysis.getTime(),
        diseaseOutbreak.earlyResponseActions.initiateInvestigation.getTime(),
        diseaseOutbreak.earlyResponseActions.establishCoordination.getTime(),
        diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.date?.getTime(),
        diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.date?.getTime(),
        diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.date?.getTime(),
    ])
        .compact()
        .value();

    const earliestRespondDate: Date = new Date(Math.min(...responseActionDates));
    return {
        RTSL_ZEB_TEA_EVENT_NAME: diseaseOutbreak.name,
        RTSL_ZEB_TEA_DATA_SOURCE: diseaseOutbreak.dataSource,
        RTSL_ZEB_TEA_HAZARD_TYPE: diseaseOutbreak.hazardType
            ? hazardTypeCodeMap[diseaseOutbreak.hazardType]
            : "",
        RTSL_ZEB_TEA_MAIN_SYNDROME: diseaseOutbreak.mainSyndromeCode ?? "",
        RTSL_ZEB_TEA_SUSPECTED_DISEASE: diseaseOutbreak.suspectedDiseaseCode ?? "",
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
        RTSL_ZEB_TEA_EARLIEST_RESPOND_DATE: getDateAsIsoString(earliestRespondDate),
        RTSL_ZEB_TEA_RESPONSE_NARRATIVE: diseaseOutbreak.earlyResponseActions.responseNarrative,
        RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER: diseaseOutbreak.incidentManagerName,
        RTSL_ZEB_TEA_NOTES: diseaseOutbreak.notes ?? "",
        RTSL_ZEB_TEA_CASE_DATA_SOURCE: "",
    };
}

export function getHazardTypeByCode(hazardTypeCode: string): HazardType | undefined {
    return (Object.keys(hazardTypeCodeMap) as HazardType[]).find(
        key => hazardTypeCodeMap[key] === hazardTypeCode
    );
}

export function getHazardTypeFromString(hazardTypeString: string): HazardType | undefined {
    return (Object.keys(hazardTypeCodeMap) as HazardType[]).find(
        hazardType => hazardType === hazardTypeString
    );
}

function getOUTextFromList(OUs: string[]): string {
    return OUs[0] ?? ""; //TO DO : Handle multiple provinces/districts once metadata change is done
}

function getNaValue(naValue: Maybe<boolean>): string {
    return naValue ? "true" : "";
}
