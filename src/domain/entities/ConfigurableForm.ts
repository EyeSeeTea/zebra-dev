import { Maybe } from "../../utils/ts-utils";
import { TeamMember } from "./incident-management-team/TeamMember";
import { Option } from "./Ref";
import { Rule } from "./Rule";
import { DiseaseOutbreakEventBaseAttrs } from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { RiskAssessment } from "./risk-assessment/RiskAssessment";

export type DiseaseOutbreakEventOptions = {
    dataSources: Option[];
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    incidentStatus: Option[];
    teamMembers: TeamMember[];
};

export type RiskAssessmentOptions = {};

export type FormLables = {
    errors: Record<string, string>;
};

export type DiseaseOutbreakEventFormData = {
    type: "disease-outbreak-event";
    entity: Maybe<DiseaseOutbreakEventBaseAttrs>;
    options: DiseaseOutbreakEventOptions;
};

export type RiskAssessmentFormData = {
    type: "risk-assessment";
    entity: Maybe<RiskAssessment>;
    options: RiskAssessmentOptions;
};

type FormData = DiseaseOutbreakEventFormData | RiskAssessmentFormData;

export type ConfigurableForm = {
    data: FormData;
    labels: FormLables;
    rules: Rule[];
};
