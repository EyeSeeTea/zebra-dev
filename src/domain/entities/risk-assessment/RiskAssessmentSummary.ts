import { Maybe } from "../../../utils/ts-utils";
import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type RiskAssessor = {
    riskAssessorFirstName: string;
    riskAssessorLastName: string;
    riskAssessorTitle: string;
    addAnotherRiskAssessor: boolean;
};
interface RiskAssessmentSummaryAttrs {
    riskAssessmentDate: Date;
    riskAssessors: RiskAssessor[];
    qualitativeRiskAssessment: string;
    overallRiskNational: Maybe<NamedRef>;
    overallRiskRegional: Maybe<NamedRef>;
    overallRiskGlobal: Maybe<NamedRef>;
    overAllConfidencNational: Maybe<NamedRef>;
    overAllConfidencRegional: Maybe<NamedRef>;
    overAllConfidencGlobal: Maybe<NamedRef>;
}

export class RiskAssessmentSummary extends Struct<RiskAssessmentSummaryAttrs>() {}
