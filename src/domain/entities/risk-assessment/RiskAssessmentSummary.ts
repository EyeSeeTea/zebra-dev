import { Id, NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";
import { TeamMember } from "../incident-management-team/TeamMember";

export interface RiskAssessmentSummaryAttrs {
    id: Id;
    riskAssessmentDate: Date; //SNEHA QUERY - Do we need this?.
    riskAssessors: TeamMember[];
    qualitativeRiskAssessment: string;
    overallRiskNational: NamedRef;
    overallRiskRegional: NamedRef;
    overallRiskGlobal: NamedRef;
    overallConfidenceNational: NamedRef;
    overallConfidenceRegional: NamedRef;
    overallConfidenceGlobal: NamedRef;
    riskId: Id;
}

export class RiskAssessmentSummary extends Struct<RiskAssessmentSummaryAttrs>() {}
