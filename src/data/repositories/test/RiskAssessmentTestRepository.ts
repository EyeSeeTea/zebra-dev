import {
    RiskAssessmentGradingFormData,
    RiskAssessmentSummaryFormData,
    RiskAssessmentQuestionnaireFormData,
} from "../../../domain/entities/ConfigurableForm";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { RiskAssessment } from "../../../domain/entities/risk-assessment/RiskAssessment";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentQuestionnaire } from "../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentRepository } from "../../../domain/repositories/RiskAssessmentRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import {
    RiskAssessmentQuestionnaireDataValues,
    RiskAssessmentSummaryDataValues,
} from "../RiskAssessmentD2Repository";

export class RiskAssessmentTestRepository implements RiskAssessmentRepository {
    getRiskAssessmentQuestionnaire(
        _diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentQuestionnaireDataValues>> {
        throw new Error("Method not implemented.");
    }
    saveRiskAssessment(
        _formData:
            | RiskAssessmentGradingFormData
            | RiskAssessmentSummaryFormData
            | RiskAssessmentQuestionnaireFormData,
        _diseaseOutbreakId: Id
    ): FutureData<void> {
        throw new Error("Method not implemented.");
    }

    getAllRiskAssessmentGrading(_diseaseOutbreakId: Id): FutureData<RiskAssessmentGrading[]> {
        throw new Error("Method not implemented.");
    }
    getRiskAssessmentSummary(
        _diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentSummaryDataValues>> {
        throw new Error("Method not implemented.");
    }

    getAll(_diseaseOutbreakId: Id): FutureData<RiskAssessment> {
        return Future.success(
            new RiskAssessment({
                grading: [],
                summary: new RiskAssessmentSummary({
                    id: "1",
                    riskAssessmentDate: new Date(),
                    riskAssessors: [],
                    qualitativeRiskAssessment: "",
                    overallRiskNational: { id: "1", name: "Low" },
                    overallRiskRegional: { id: "1", name: "Low" },
                    overallRiskGlobal: { id: "1", name: "Low" },
                    overallConfidenceNational: { id: "1", name: "Low" },
                    overallConfidenceRegional: { id: "1", name: "Low" },
                    overallConfidenceGlobal: { id: "1", name: "Low" },
                    riskId: "1",
                }),
                questionnaire: new RiskAssessmentQuestionnaire({
                    id: "1",
                    potentialRiskForHumanHealth: {
                        likelihood: { id: "1", name: "likelihood1" },
                        consequences: { id: "1", name: "consequences1" },
                        risk: { id: "1", name: "risk1" },
                        rational: "rational1",
                    },
                    riskOfEventSpreading: {
                        likelihood: { id: "1", name: "likelihood1" },
                        consequences: { id: "1", name: "consequences1" },
                        risk: { id: "1", name: "risk1" },
                        rational: "rational1",
                    },
                    riskOfInsufficientCapacities: {
                        likelihood: { id: "1", name: "likelihood1" },
                        consequences: { id: "1", name: "consequences1" },
                        risk: { id: "1", name: "risk1" },
                        rational: "rational1",
                    },
                    //custom questions added by user
                    additionalQuestions: [],
                }),
            })
        );
    }
}
