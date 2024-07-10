import { Property } from "../Properties";
import { Struct } from "../generic/Struct";

interface RiskAssessmentQuestionnaireAttrs {
    questions: Property[];
}

export class RiskAssessmentQuestionnaire extends Struct<RiskAssessmentQuestionnaireAttrs>() {}
