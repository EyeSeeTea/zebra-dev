import { Maybe } from "../../utils/ts-utils";
import { TeamMember } from "./incident-management-team/TeamMember";
import { Option } from "./Ref";
import { Rule } from "./Rule";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { RiskAssessmentGrading } from "./risk-assessment/RiskAssessmentGrading";
import { EventTrackerDetails } from "../../webapp/contexts/current-event-tracker-context";
import { RiskAssessmentSummary } from "./risk-assessment/RiskAssessmentSummary";

export type DiseaseOutbreakEventOptions = {
    dataSources: Option[];
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    incidentStatus: Option[];
    teamMembers: TeamMember[];
};

export type RiskAssessmentGradingOptions = {
    populationAtRisk: Option[];
    attackRate: Option[];
    geographicalSpread: Option[];
    complexity: Option[];
    capacity: Option[];
    reputationalRisk: Option[];
    severity: Option[];
    capability: Option[];
};

export type RiskAssessmentSummaryOptions = {
    overallRiskNational: Option[];
    overallRiskRegional: Option[];
    overallRiskGlobal: Option[];
    overAllConfidencNational: Option[];
    overAllConfidencRegional: Option[];
    overAllConfidencGlobal: Option[];
    riskAssessors: TeamMember[];
};

export type FormLables = {
    errors: Record<string, string>;
};

type BaseFormData = {
    labels: FormLables;
    rules: Rule[];
    type: FormType;
};
export type DiseaseOutbreakEventFormData = BaseFormData & {
    type: "disease-outbreak-event";
    entity: Maybe<DiseaseOutbreakEventBaseAttrs>;
    options: DiseaseOutbreakEventOptions;
};

export type RiskAssessmentGradingFormData = BaseFormData & {
    type: "risk-assessment-grading";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: Maybe<RiskAssessmentGrading>;
    options: RiskAssessmentGradingOptions;
};

export type RiskAssessmentSummaryFormData = BaseFormData & {
    type: "risk-assessment-summary";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: Maybe<RiskAssessmentSummary>;
    options: RiskAssessmentSummaryOptions;
};

export type ConfigurableForm =
    | DiseaseOutbreakEventFormData
    | RiskAssessmentGradingFormData
    | RiskAssessmentSummaryFormData;
