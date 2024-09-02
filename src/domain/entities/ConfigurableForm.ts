import { Maybe } from "../../utils/ts-utils";
import { TeamMember } from "./incident-management-team/TeamMember";
import { Id, Option } from "./Ref";
import { Rule } from "./Rule";
import { DiseaseOutbreakEventBaseAttrs } from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { RiskAssessmentGrading } from "./risk-assessment/RiskAssessmentGrading";

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
    diseaseOutbreakId: Id;
    entity: Maybe<RiskAssessmentGrading>;
    options: RiskAssessmentOptions;
};

export type ConfigurableForm = DiseaseOutbreakEventFormData | RiskAssessmentGradingFormData;
