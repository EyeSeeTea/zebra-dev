import { FutureData } from "../../data/api-futures";
import {
    RiskAssessmentQuestionnaireBaseDataValues,
    RiskAssessmentQuestionnaireDataValues,
    RiskAssessmentSummaryDataValues,
} from "../../data/repositories/RiskAssessmentD2Repository";
import { Maybe } from "../../utils/ts-utils";
import {
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentSummaryFormData,
} from "../entities/ConfigurableForm";
import { Id } from "../entities/Ref";
import { RiskAssessmentGrading } from "../entities/risk-assessment/RiskAssessmentGrading";

export interface RiskAssessmentRepository {
    getAllRiskAssessmentGrading(diseaseOutbreakId: Id): FutureData<RiskAssessmentGrading[]>;
    getRiskAssessmentSummary(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentSummaryDataValues>>;
    getRiskAssessmentQuestionnaire(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentQuestionnaireDataValues>>;
    saveRiskAssessment(
        formData:
            | RiskAssessmentGradingFormData
            | RiskAssessmentSummaryFormData
            | RiskAssessmentQuestionnaireFormData,
        diseaseOutbreakId: Id
    ): FutureData<void>;
}
