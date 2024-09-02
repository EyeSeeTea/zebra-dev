import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentGradingRepository } from "../../../domain/repositories/RiskAssessmentGradingRepository";
import { FutureData } from "../../api-futures";

export class RiskAssessmentGradingTestRepository implements RiskAssessmentGradingRepository {
    save(_riskAssessmentGrading: RiskAssessmentGrading, _diseaseOutbreakId: Id): FutureData<void> {
        return Future.success(undefined);
    }
}
