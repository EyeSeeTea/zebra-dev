import {
    AllOptionTypes,
    Grade,
    RiskAssessmentGrading,
    RiskAssessmentGradingAttrs,
} from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { GetValue } from "../../../utils/ts-utils";

export const riskAssessmentGradingOptionCodeMap: Record<Exclude<AllOptionTypes, Grade>, string> = {
    LessPercentage: "RTSL_ZEB_OS_POPULATION_AT_RISK_1",
    MediumPercentage: "RTSL_ZEB_OS_POPULATION_AT_RISK_2",
    HighPercentage: "RTSL_ZEB_OS_POPULATION_AT_RISK_3",
    Low: "RTSL_ZEB_OS_LMH_LOW",
    Medium: "RTSL_ZEB_OS_LMH_MEDIUM",
    High: "RTSL_ZEB_OS_LMH_HIGH",
    WithinDistrict: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_1",
    MoretThanOneDistrict: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_2",
    MoreThanOneProvince: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_3",
    ProvincialNationalLevel: "RTSL_ZEB_OS_CAPACITY_1",
    ProvincialLevel: "RTSL_ZEB_OS_CAPACITY_2",
    NationalInternationalLevel: "RTSL_ZEB_OS_CAPACITY_3",
    Capability1: "RTSL_ZEB_OS_CAPABILITY_1",
    Capability2: "RTSL_ZEB_OS_CAPABILITY_2",
} as const;
export type RiskAssessmentGradingOptionKeyCode =
    (typeof riskAssessmentGradingOptionCodeMap)[keyof typeof riskAssessmentGradingOptionCodeMap];

export const riskAssessmentGradingCodes: Record<
    keyof RiskAssessmentGradingAttrs | "grade",
    string
> = {
    populationAtRisk: "RTSL_ZEB_DET_POPULATION_RISK",
    attackRate: "RTSL_ZEB_DET_ATTACK_RATE",
    geographicalSpread: "RTSL_ZEB_DET_GEOGRAPHICAL_SPREAD",
    complexity: "RTSL_ZEB_DET_COMPLEXITY",
    capacity: "RTSL_ZEB_DET_CAPACITY",
    reputationalRisk: "RTSL_ZEB_DET_REPUTATIONAL_RISK",
    severity: "RTSL_ZEB_DET_SEVERITY",
    capability: "RTSL_ZEB_DET_CAPABILITY",
    grade: "RTSL_ZEB_DET_GRADE",
    id: "RTSL_ZEB_DET_RISK_ID_RAG",
    lastUpdated: "",
} as const;
export type RiskAssessmentGradingCodes = GetValue<typeof riskAssessmentGradingCodes>;

export function isStringInRiskAssessmentGradingOptionCodes(
    code: string
): code is RiskAssessmentGradingOptionKeyCode {
    return (Object.values(riskAssessmentGradingOptionCodeMap) as string[]).includes(code);
}
export type RiskAssessmentGradingKeyCode =
    (typeof riskAssessmentGradingCodes)[keyof typeof riskAssessmentGradingCodes];

export function isStringInRiskAssessmentGradingCodes(
    code: string
): code is RiskAssessmentGradingKeyCode {
    return (Object.values(riskAssessmentGradingCodes) as string[]).includes(code);
}

export function getValueFromRiskAssessmentGrading(
    riskAssessmentGrading: RiskAssessmentGrading
): Record<RiskAssessmentGradingCodes, string> {
    return {
        RTSL_ZEB_DET_POPULATION_RISK:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.populationAtRisk.type],
        RTSL_ZEB_DET_ATTACK_RATE:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.attackRate.type],
        RTSL_ZEB_DET_GEOGRAPHICAL_SPREAD:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.geographicalSpread.type],
        RTSL_ZEB_DET_COMPLEXITY:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.complexity.type],
        RTSL_ZEB_DET_CAPACITY:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.capacity.type],
        RTSL_ZEB_DET_REPUTATIONAL_RISK:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.reputationalRisk.type],
        RTSL_ZEB_DET_SEVERITY:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.severity.type],
        RTSL_ZEB_DET_CAPABILITY:
            riskAssessmentGradingOptionCodeMap[riskAssessmentGrading.capability.type],
        RTSL_ZEB_DET_GRADE: getGradeValue(riskAssessmentGrading.getGrade().getOrThrow()),
        RTSL_ZEB_DET_RISK_ID_RAG: "",
    };
}

function getGradeValue(grade: Grade): string {
    switch (grade) {
        case "Grade1":
            return "1";
        case "Grade2":
            return "2";
        case "Grade3":
            return "3";
    }
}
