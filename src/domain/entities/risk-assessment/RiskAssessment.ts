import { Struct } from "../generic/Struct";
import { RiskAssessmentGrading } from "./RiskAssessmentGrading";
import { RiskAssessmentQuestionnaire } from "./RiskAssessmentQuestionnaire";
import { RiskAssessmentSummary } from "./RiskAssessmentSummary";

interface RiskAssessmentAttrs {
    grading: RiskAssessmentGrading[];
    summary?: RiskAssessmentSummary;
    questionnaire?: RiskAssessmentQuestionnaire;
}

export class RiskAssessment extends Struct<RiskAssessmentAttrs>() {
    
}
