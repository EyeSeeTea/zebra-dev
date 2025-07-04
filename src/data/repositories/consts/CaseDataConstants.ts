import { GetValue } from "../../../utils/ts-utils";
import {
    CaseData,
    DiseaseOutbreakEvent,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export const RTSL_ZEBRA_CASE_PROGRAM_ID = "A0fHWmkFPzX";
export const RTSL_ZEBRA_CASE_PROGRAM_STAGE_ID = "aEUOfKt3cNP";
export const RTSL_ZEB_DET_NATIONAL_EVENT_ID_ID = "ylPUzBomYdb";

export const casesDataCodes = {
    suspectedDisease: "RTSL_ZEB_DET_SUSPECTED_DISEASE",
    lastUpdatedBy: "RTSL_ZEB_ALERTS_EVT_LAST_UPDATED_BY",
    lastUpdatedAt: "RTSL_ZEB_ALERTS_EVT_LAST_UPDATED",
    suspectedCases: "RTSL_ZEB_DET_SUS_CASES",
    probableCases: "RTSL_ZEB_DET_PROB_CASES",
    confirmedCases: "RTSL_ZEB_DET_CONF_CASES",
    deaths: "RTSL_ZEB_DET_DEATHS",
    diseaseOutbreakId: "RTSL_ZEB_DET_NATIONAL_EVENT_ID",
    dataSource: "RTSL_ZEB_DET_DATA_SOURCE",
} as const;

export type CasesDataCode = GetValue<typeof casesDataCodes>;

export type CasesDataKeyCode = (typeof casesDataCodes)[keyof typeof casesDataCodes];

export function isStringInCasesDataCodes(code: string): code is CasesDataKeyCode {
    return (Object.values(casesDataCodes) as string[]).includes(code);
}

export function getCasesDataValuesFromDiseaseOutbreak(
    caseData: CaseData,
    diseaseOutbreak: DiseaseOutbreakEvent
): Record<CasesDataCode, string> {
    const nationalEventId = diseaseOutbreak.id;
    const suspectedDiseaseCode = diseaseOutbreak.suspectedDiseaseCode ?? "";

    if (!nationalEventId || !suspectedDiseaseCode) {
        throw new Error("Missing required data for cases data");
    }

    return {
        RTSL_ZEB_DET_SUSPECTED_DISEASE: suspectedDiseaseCode,
        RTSL_ZEB_ALERTS_EVT_LAST_UPDATED_BY: caseData.updatedBy,
        RTSL_ZEB_ALERTS_EVT_LAST_UPDATED: new Date().toISOString(),
        RTSL_ZEB_DET_SUS_CASES: caseData.suspectedCases.toString(),
        RTSL_ZEB_DET_PROB_CASES: caseData.probableCases.toString(),
        RTSL_ZEB_DET_CONF_CASES: caseData.confirmedCases.toString(),
        RTSL_ZEB_DET_DEATHS: caseData.deaths.toString(),
        RTSL_ZEB_DET_NATIONAL_EVENT_ID: nationalEventId,
        RTSL_ZEB_DET_DATA_SOURCE: "",
    };
}
