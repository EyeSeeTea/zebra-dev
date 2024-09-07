import {
    RiskAssessmentGrading,
    riskAssessmentGradingCodes,
} from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { GetValue } from "../../../utils/ts-utils";

export type RiskAssessmentGradingCodes = GetValue<typeof riskAssessmentGradingCodes>;

//SNEHA TO DO : Better naming for these codes in metadata
export const riskAssessmentGradingOptionCodes = {
    populationAtRisk: {
        LessPercentage: "RTSL_ZEB_OS_POPULATION_AT_RISK_1",
        MediumPercentage: "RTSL_ZEB_OS_POPULATION_AT_RISK_2",
        HighPercentage: "RTSL_ZEB_OS_POPULATION_AT_RISK_3",
    },
    weightedOption: {
        Low: "RTSL_ZEB_OS_LMH_LOW",
        Medium: "RTSL_ZEB_OS_LMH_MEDIUM",
        High: "RTSL_ZEB_OS_LMH_HIGH",
    },
    geographicalSpread: {
        WithinDistrict: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_1",
        MoretThanOneDistrict: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_2",
        MoreThanOneProvince: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_3",
    },
    capacity: {
        ProvincialNationalLevel: "RTSL_ZEB_OS_CAPACITY_1",
        ProvincialLevel: "RTSL_ZEB_OS_CAPACITY_2",
        NationalInternationalLevel: "RTSL_ZEB_OS_CAPACITY_3",
    },
    capability: {
        Capability1: "RTSL_ZEB_OS_CAPABILITY_1",
        Capability2: "RTSL_ZEB_OS_CAPABILITY_2",
    },
    grade: {
        Grade1: "1",
        Grade2: "2",
        Grade3: "3",
    },
};

export function getValueFromRiskAssessmentGrading(
    riskAssessmentGrading: RiskAssessmentGrading
): Record<RiskAssessmentGradingCodes, string> {
    return {
        RTSL_ZEB_DET_POPULATION_RISK:
            riskAssessmentGradingOptionCodes.populationAtRisk[
                riskAssessmentGrading.populationAtRisk.type
            ],
        RTSL_ZEB_DET_ATTACK_RATE:
            riskAssessmentGradingOptionCodes.weightedOption[riskAssessmentGrading.attackRate.type],
        RTSL_ZEB_DET_GEOGRAPHICAL_SPREAD:
            riskAssessmentGradingOptionCodes.geographicalSpread[
                riskAssessmentGrading.geographicalSpread.type
            ],
        RTSL_ZEB_DET_COMPLEXITY:
            riskAssessmentGradingOptionCodes.weightedOption[riskAssessmentGrading.complexity.type],
        RTSL_ZEB_DET_CAPACITY:
            riskAssessmentGradingOptionCodes.capacity[riskAssessmentGrading.capacity.type],
        RTSL_ZEB_DET_REPUTATIONAL_RISK:
            riskAssessmentGradingOptionCodes.weightedOption[
                riskAssessmentGrading.reputationalRisk.type
            ],
        RTSL_ZEB_DET_SEVERITY:
            riskAssessmentGradingOptionCodes.weightedOption[riskAssessmentGrading.severity.type],
        RTSL_ZEB_DET_CAPABILITY:
            riskAssessmentGradingOptionCodes.capability[riskAssessmentGrading.capability.type],
        RTSL_ZEB_DET_GRADE:
            riskAssessmentGradingOptionCodes.grade[riskAssessmentGrading.getGrade().getOrThrow()],
        RTSL_ZEB_DET_RISK_ID_RAG: "",
    };
}

export type RiskAssessmentGradingKeyCode =
    (typeof riskAssessmentGradingCodes)[keyof typeof riskAssessmentGradingCodes];
export function isStringIRiskAssessmentGradingCodes(
    code: string
): code is RiskAssessmentGradingKeyCode {
    return (Object.values(riskAssessmentGradingCodes) as string[]).includes(code);
}
