import { FutureData } from "../../../../data/api-futures";
import { Id } from "../../../entities/Ref";
import { RiskAssessmentGrading } from "../../../entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentSummary } from "../../../entities/risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentRepository } from "../../../repositories/RiskAssessmentRepository";

export function saveRiskAssessmentGrading(
    riskAssessmentRepository: RiskAssessmentRepository,
    riskAssessmentGrading: RiskAssessmentGrading,
    diseaseOutbreakId: Id
): FutureData<void> {
    return riskAssessmentRepository.saveGrading(riskAssessmentGrading, diseaseOutbreakId);
}

export function saveRiskAssessmentSummary(
    riskAssessmentRepository: RiskAssessmentRepository,
    riskAssessmentSummary: RiskAssessmentSummary,
    diseaseOutbreakId: Id
): FutureData<void> {
    return riskAssessmentRepository.saveSummary(riskAssessmentSummary, diseaseOutbreakId);
}
