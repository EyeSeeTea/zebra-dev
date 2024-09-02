import { FutureData } from "../../../../data/api-futures";
import { Id } from "../../../entities/Ref";
import { RiskAssessmentGrading } from "../../../entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentGradingRepository } from "../../../repositories/RiskAssessmentGradingRepository";

export function saveRiskAssessmentGrading(
    riskAssessmentGradingRepository: RiskAssessmentGradingRepository,
    riskAssessmentGrading: RiskAssessmentGrading,
    diseaseOutbreakId: Id
): FutureData<void> {
    return riskAssessmentGradingRepository.save(riskAssessmentGrading, diseaseOutbreakId);
}
