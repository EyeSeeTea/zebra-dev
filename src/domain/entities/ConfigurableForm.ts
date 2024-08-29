import { Maybe } from "../../utils/ts-utils";
import { TeamMember } from "./incident-management-team/TeamMember";
import { Option } from "./Ref";
import { Rule } from "./Rule";
import { DiseaseOutbreakEventBaseAttrs } from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { RiskAssessment } from "./risk-assessment/RiskAssessment";
import { FormType } from "../../webapp/pages/form-page/FormPage";

export type DiseaseOutbreakEventOptions = {
    dataSources: Option[];
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    incidentStatus: Option[];
    teamMembers: TeamMember[];
};

export type RiskAssessmentOptions = {
    populationAtRisk: Option[];
    attackRate: Option[];
    geographicalSpread: Option[];
    complexity: Option[];
    capacity: Option[];
    reputationalRisk: Option[];
    severity: Option[];
    capability: Option[];
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
    entity: Maybe<RiskAssessment>;
    options: RiskAssessmentOptions;
};

export type ConfigurableForm = DiseaseOutbreakEventFormData | RiskAssessmentGradingFormData;
