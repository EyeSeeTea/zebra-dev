import { Struct } from "../generic/Struct";
import { RiskAssessmentGrading } from "./RiskAssessmentGrading";
import { RiskAssessmentQuestionnaire } from "./RiskAssessmentQuestionnaire";
import { RiskAssessmentSummary } from "./RiskAssessmentSummary";

interface RiskAssessmentAttrs {
    riskAssessmentGrading: RiskAssessmentGrading[];
    riskAssessmentSummary: RiskAssessmentSummary;
    riskAssessmentQuestionnaire: RiskAssessmentQuestionnaire[];
}

export class RiskAssessment extends Struct<RiskAssessmentAttrs>() {}
