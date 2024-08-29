import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type RiskAssessmentQuestion = {
    question: string;
    likelihood: NamedRef;
    consequences: NamedRef;
    risk: NamedRef;
    rational: string;
};

interface RiskAssessmentQuestionnaireAttrs {
    //standard questions
    potentialRiskForHumanHealth: RiskAssessmentQuestion;
    riskOfEventSpreading: RiskAssessmentQuestion;
    riskOfInsufficientCapacities: RiskAssessmentQuestion;
    //custom questions added by user
    addtionalQuestions: RiskAssessmentQuestion[];
}

export class RiskAssessmentQuestionnaire extends Struct<RiskAssessmentQuestionnaireAttrs>() {}
