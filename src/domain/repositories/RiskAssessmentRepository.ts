import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { RiskAssessment } from "../entities/risk-assessment/RiskAssessment";

export interface RiskAssessmentRepository {
    getAll(diseaseOutbreakId: Id): FutureData<RiskAssessment>;
}
