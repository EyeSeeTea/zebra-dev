import { Property } from "../Properties";
import { Struct } from "../generic/Struct";

interface RiskAssessmentSummaryAttrs {
    properties: Property[];
}

export class RiskAssessmentSummary extends Struct<RiskAssessmentSummaryAttrs>() {}
