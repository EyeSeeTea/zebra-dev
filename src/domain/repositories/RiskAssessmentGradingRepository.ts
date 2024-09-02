import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { RiskAssessmentGrading } from "../entities/risk-assessment/RiskAssessmentGrading";

export interface RiskAssessmentGradingRepository {
    save(riskAssessmentGrading: RiskAssessmentGrading, diseaseOutbreakId: Id): FutureData<void>;
}
