import { FutureData } from "../../data/api-futures";
import { RiskAssessmentSummaryDataValues } from "../../data/repositories/RiskAssessmentD2Repository";
import { Maybe } from "../../utils/ts-utils";
import { Id } from "../entities/Ref";
import { RiskAssessmentGrading } from "../entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentSummary } from "../entities/risk-assessment/RiskAssessmentSummary";

export interface RiskAssessmentRepository {
    getAllRiskAssessmentGrading(diseaseOutbreakId: Id): FutureData<RiskAssessmentGrading[]>;
    getRiskAssessmentSummary(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentSummaryDataValues>>;
    saveGrading(
        riskAssessmentGrading: RiskAssessmentGrading,
        diseaseOutbreakId: Id
    ): FutureData<void>;
    saveSummary(
        riskAssessmentSummary: RiskAssessmentSummary,
        diseaseOutbreakId: Id
    ): FutureData<void>;
}
