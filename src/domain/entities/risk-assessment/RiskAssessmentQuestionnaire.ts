import { Id, NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

export type RiskAssessmentQuestion = {
    question?: string;
    likelihood: NamedRef;
    consequences: NamedRef;
    risk: NamedRef;
    rational: string;
};

interface RiskAssessmentQuestionnaireAttrs {
    //standard questions
    id: Id;
    potentialRiskForHumanHealth: RiskAssessmentQuestion;
    riskOfEventSpreading: RiskAssessmentQuestion;
    riskOfInsufficientCapacities: RiskAssessmentQuestion;
    //custom questions added by user
    additionalQuestions: RiskAssessmentQuestion[];
}

export class RiskAssessmentQuestionnaire extends Struct<RiskAssessmentQuestionnaireAttrs>() {}
