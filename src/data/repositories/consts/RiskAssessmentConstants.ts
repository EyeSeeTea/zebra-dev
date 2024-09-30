import {
    AllOptionTypes,
    Grade,
    RiskAssessmentGrading,
    RiskAssessmentGradingAttrs,
} from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentQuestionnaire } from "../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
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

export const riskAssessmentSummaryCodes = {
    riskAssessmentDate: "RTSL_ZEB_DET_RADATE",
    riskGrade: "RTSL_ZEB_DET_RAG", //TO DO SNEHA : Do we need this?
    riskId: "RTSL_ZEB_DET_RISK_ID_RAS", //TO DO SNEHA : Do we need this?
    riskAssessor1: "RTSL_ZEB_DET_RA1",
    addAnotherRiskAssessor1: "RTSL_ZEB_DET_OTHER_RAD1",
    riskAssessor2: "RTSL_ZEB_DET_RA2",
    addAnotherRiskAssessor2: "RTSL_ZEB_DET_OTHER_RAD2",
    riskAssessor3: "RTSL_ZEB_DET_RA3",
    addAnotherRiskAssessor3: "RTSL_ZEB_DET_OTHER_RAD3",
    riskAssessor4: "RTSL_ZEB_DET_RA4",
    addAnotherRiskAssessor4: "RTSL_ZEB_DET_OTHER_RAD4",
    riskAssessor5: "RTSL_ZEB_DET_RA5",
    qualitativeRiskAssessment: "RTSL_ZEB_DET_QRA",
    overallRiskNational: "RTSL_ZEB_DET_QR_NATIONAL",
    overallRiskRegional: "RTSL_ZEB_DET_QR_REGIONAL",
    overallRiskGlobal: "RTSL_ZEB_DET_QR_GLOBAL",
    overallConfidenceNational: "RTSL_ZEB_DET_OC_NATIONAL",
    overallConfidenceRegional: "RTSL_ZEB_DET_OC_REGIONAL",
    overallConfidenceGlobal: "RTSL_ZEB_DET_OC_GLOBAL",
} as const;
export type RiskAssessmentSummaryCodes = GetValue<typeof riskAssessmentSummaryCodes>;

export const riskAssessmentQuestionnaireCodes = {
    question: "RTSL_ZEB_DET_QUESTION",
    likelihood1: "RTSL_ZEB_DET_LIKELIHOOD",
    consequences1: "RTSL_ZEB_DET_CONSEQUENCES",
    risk1: "RTSL_ZEB_DET_RISK",
    rational1: "RTSL_ZEB_DET_RATIONALE",
    likelihood2: "RTSL_ZEB_DET_LIKELIHOOD2",
    consequences2: "RTSL_ZEB_DET_CONSEQUENCES2",
    risk2: "RTSL_ZEB_DET_RISK2",
    rational2: "RTSL_ZEB_DET_RATIONALE2",
    likelihood3: "RTSL_ZEB_DET_LIKELIHOOD3",
    consequences3: "RTSL_ZEB_DET_CONSEQUENCES3",
    risk3: "RTSL_ZEB_DET_RISK3",
    rational3: "RTSL_ZEB_DET_RATIONALE3",
    riskId: "RTSL_ZEB_DET_RISK_ID_RAQ",
    riskId2: "RTSL_ZEB_DET_RISK_ID_RAQ2",
    riskId3: "RTSL_ZEB_DET_RISK_ID_RAQ3",
} as const;

export type RiskAssessmentQuestionnaireCodes = GetValue<typeof riskAssessmentQuestionnaireCodes>;

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

export function getValueFromRiskAssessmentSummary(
    riskAssessmentSummary: RiskAssessmentSummary
): Record<RiskAssessmentSummaryCodes, string> {
    return {
        RTSL_ZEB_DET_RADATE: riskAssessmentSummary.riskAssessmentDate.toISOString(),
        RTSL_ZEB_DET_RAG: "", //TO DO SNEHA : Do we need this?
        RTSL_ZEB_DET_RISK_ID_RAS: "", //TO DO SNEHA : Do we need this?
        RTSL_ZEB_DET_RA1: riskAssessmentSummary.riskAssessors[0]?.username || "",
        RTSL_ZEB_DET_OTHER_RAD1: riskAssessmentSummary.riskAssessors.length > 1 ? "true" : "",
        RTSL_ZEB_DET_RA2: riskAssessmentSummary.riskAssessors[1]?.username || "",
        RTSL_ZEB_DET_OTHER_RAD2: riskAssessmentSummary.riskAssessors.length > 2 ? "true" : "",
        RTSL_ZEB_DET_RA3: riskAssessmentSummary.riskAssessors[2]?.username || "",
        RTSL_ZEB_DET_OTHER_RAD3: riskAssessmentSummary.riskAssessors.length > 3 ? "true" : "",
        RTSL_ZEB_DET_RA4: riskAssessmentSummary.riskAssessors[3]?.username || "",
        RTSL_ZEB_DET_OTHER_RAD4: riskAssessmentSummary.riskAssessors.length > 4 ? "true" : "",
        RTSL_ZEB_DET_RA5: riskAssessmentSummary.riskAssessors[4]?.username || "",
        RTSL_ZEB_DET_QRA: riskAssessmentSummary.qualitativeRiskAssessment,
        RTSL_ZEB_DET_QR_NATIONAL: riskAssessmentSummary.overallRiskNational.id,
        RTSL_ZEB_DET_QR_REGIONAL: riskAssessmentSummary.overallRiskRegional.id,
        RTSL_ZEB_DET_QR_GLOBAL: riskAssessmentSummary.overallRiskGlobal.id,
        RTSL_ZEB_DET_OC_NATIONAL: riskAssessmentSummary.overallConfidenceNational.id,
        RTSL_ZEB_DET_OC_REGIONAL: riskAssessmentSummary.overallConfidenceRegional.id,
        RTSL_ZEB_DET_OC_GLOBAL: riskAssessmentSummary.overallConfidenceGlobal.id,
    };
}

export type RiskAssessmentSummaryKeyCode =
    (typeof riskAssessmentSummaryCodes)[keyof typeof riskAssessmentSummaryCodes];

export function isStringInRiskAssessmentSummaryCodes(
    code: string
): code is RiskAssessmentSummaryKeyCode {
    return (Object.values(riskAssessmentSummaryCodes) as string[]).includes(code);
}

export function getValueFromRiskAssessmentQuestionnaire(
    riskAssessmentQuestionnaire: RiskAssessmentQuestionnaire
): Record<RiskAssessmentQuestionnaireCodes, string> {
    return {
        RTSL_ZEB_DET_LIKELIHOOD:
            riskAssessmentQuestionnaire.potentialRiskForHumanHealth.likelihood.id,
        RTSL_ZEB_DET_CONSEQUENCES:
            riskAssessmentQuestionnaire.potentialRiskForHumanHealth.consequences.id,
        RTSL_ZEB_DET_RISK: riskAssessmentQuestionnaire.potentialRiskForHumanHealth.risk.id,
        RTSL_ZEB_DET_RATIONALE: riskAssessmentQuestionnaire.potentialRiskForHumanHealth.rational,
        RTSL_ZEB_DET_LIKELIHOOD2: riskAssessmentQuestionnaire.riskOfEventSpreading.likelihood.id,
        RTSL_ZEB_DET_CONSEQUENCES2:
            riskAssessmentQuestionnaire.riskOfEventSpreading.consequences.id,
        RTSL_ZEB_DET_RISK2: riskAssessmentQuestionnaire.riskOfEventSpreading.risk.id,
        RTSL_ZEB_DET_RATIONALE2: riskAssessmentQuestionnaire.riskOfEventSpreading.rational,
        RTSL_ZEB_DET_LIKELIHOOD3:
            riskAssessmentQuestionnaire.riskOfInsufficientCapacities.likelihood.id,
        RTSL_ZEB_DET_CONSEQUENCES3:
            riskAssessmentQuestionnaire.riskOfInsufficientCapacities.consequences.id,
        RTSL_ZEB_DET_RISK3: riskAssessmentQuestionnaire.riskOfInsufficientCapacities.risk.id,
        RTSL_ZEB_DET_RATIONALE3: riskAssessmentQuestionnaire.riskOfInsufficientCapacities.rational,
        RTSL_ZEB_DET_QUESTION: "",
        RTSL_ZEB_DET_RISK_ID_RAQ: "",
        RTSL_ZEB_DET_RISK_ID_RAQ2: "",
        RTSL_ZEB_DET_RISK_ID_RAQ3: "",
    };
}
export type RiskAssessmentQuestionnaireKeyCode =
    (typeof riskAssessmentQuestionnaireCodes)[keyof typeof riskAssessmentQuestionnaireCodes];

export function isStringInRiskAssessmentQuestionnaireCodes(
    code: string
): code is RiskAssessmentQuestionnaireKeyCode {
    return (Object.values(riskAssessmentQuestionnaireCodes) as string[]).includes(code);
}
