import {
    RiskAssessmentGrading,
    riskAssessmentGradingCodes,
} from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { GetValue } from "../../../utils/ts-utils";

export type RiskAssessmentGradingCodes = GetValue<typeof riskAssessmentGradingCodes>;
export function getValueFromRiskAssessmentGrading(
    riskAssessmentGrading: RiskAssessmentGrading
): Record<RiskAssessmentGradingCodes, string> {
    return {
        RTSL_ZEB_DET_POPULATION_RISK: riskAssessmentGrading.populationAtRisk.type,
        RTSL_ZEB_DET_ATTACK_RATE: riskAssessmentGrading.attackRate.type,
        RTSL_ZEB_DET_GEOGRAPHICAL_SPREAD: riskAssessmentGrading.geographicalSpread.type,
        RTSL_ZEB_DET_COMPLEXITY: riskAssessmentGrading.complexity.type,
        RTSL_ZEB_DET_CAPACITY: riskAssessmentGrading.capacity.type,
        RTSL_ZEB_DET_REPUTATIONAL_RISK: riskAssessmentGrading.reputationalRisk.type,
        RTSL_ZEB_DET_SEVERITY: riskAssessmentGrading.severity.type,
        RTSL_ZEB_DET_CAPABILITY: riskAssessmentGrading.capability.type,
        RTSL_ZEB_DET_GRADE: riskAssessmentGrading.getGrade().getOrThrow(),
    };
}

export type RiskAssessmentGradingKeyCode =
    (typeof riskAssessmentGradingCodes)[keyof typeof riskAssessmentGradingCodes];
export function isStringIRiskAssessmentGradingCodes(
    code: string
): code is RiskAssessmentGradingKeyCode {
    return (Object.values(riskAssessmentGradingCodes) as string[]).includes(code);
}
