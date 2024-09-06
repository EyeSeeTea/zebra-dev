import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { RiskAssessment } from "../../../domain/entities/risk-assessment/RiskAssessment";
import { RiskAssessmentRepository } from "../../../domain/repositories/RiskAssessmentRepository";
import { FutureData } from "../../api-futures";

export class RiskAssessmentTestRepository implements RiskAssessmentRepository {
    getAll(_diseaseOutbreakId: Id): FutureData<RiskAssessment> {
        return Future.success(
            new RiskAssessment({
                grading: [],
            })
        );
    }
}
