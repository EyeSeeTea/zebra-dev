import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { RiskAssessment } from "../../../domain/entities/risk-assessment/RiskAssessment";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentRepository } from "../../../domain/repositories/RiskAssessmentRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import { RiskAssessmentSummaryDataValues } from "../RiskAssessmentD2Repository";

export class RiskAssessmentTestRepository implements RiskAssessmentRepository {
    getAllRiskAssessmentGrading(diseaseOutbreakId: Id): FutureData<RiskAssessmentGrading[]> {
        throw new Error("Method not implemented.");
    }
    getRiskAssessmentSummary(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentSummaryDataValues>> {
        throw new Error("Method not implemented.");
    }
    saveGrading(
        _riskAssessmentGrading: RiskAssessmentGrading,
        _diseaseOutbreakId: Id
    ): FutureData<void> {
        return Future.success(undefined);
    }
    saveSummary(
        _riskAssessmentSummary: RiskAssessmentSummary,
        _diseaseOutbreakId: Id
    ): FutureData<void> {
        return Future.success(undefined);
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
            })
        );
    }
}
