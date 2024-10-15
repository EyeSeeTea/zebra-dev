import { Maybe } from "../../utils/ts-utils";
import { TeamMember } from "./incident-management-team/TeamMember";
import { Id, Option } from "./Ref";
import { Rule } from "./Rule";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { RiskAssessmentGrading } from "./risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentSummary } from "./risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentQuestionnaire } from "./risk-assessment/RiskAssessmentQuestionnaire";
import { IncidentManagementTeam } from "./incident-management-team/IncidentManagementTeam";
import { Role } from "./incident-management-team/Role";
import { ActionPlanAttrs } from "./incident-action-plan/ActionPlan";
import { ResponseAction } from "./incident-action-plan/ResponseAction";

export type DiseaseOutbreakEventOptions = {
    dataSources: Option[];
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    incidentStatus: Option[];
    incidentManagers: TeamMember[];
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

export type RiskAssessmentQuestionnaireOptions = {
    likelihood: Option[];
    consequences: Option[];
    risk: Option[];
};

export type IncidentActionPlanOptions = {
    iapType: Option[];
    phoecLevel: Option[];
};

export type IncidentResponseActionOptions = {
    searchAssignRO: TeamMember[];
    status: Option[];
    verification: Option[];
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

export type RiskAssessmentQuestionnaireFormData = BaseFormData & {
    type: "risk-assessment-questionnaire";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: Maybe<RiskAssessmentQuestionnaire>;
    options: RiskAssessmentQuestionnaireOptions;
};

export type IncidentManagementTeamRoleOptions = {
    roles: Role[];
    teamMembers: TeamMember[];
    incidentManagers: TeamMember[];
};

export type IncidentManagementTeamMemberFormData = BaseFormData & {
    type: "incident-management-team-member-assignment";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: Maybe<TeamMember>;
    incidentManagementTeamRoleId: Maybe<Id>;
    currentIncidentManagementTeam: Maybe<IncidentManagementTeam>;
    options: IncidentManagementTeamRoleOptions;
};

export type ActionPlanFormData = BaseFormData & {
    type: "incident-action-plan";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: Maybe<ActionPlanAttrs>;
    options: IncidentActionPlanOptions;
};

export type ResponseActionFormData = BaseFormData & {
    type: "incident-response-action";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: ResponseAction[];
    options: IncidentResponseActionOptions;
};

export type ConfigurableForm =
    | DiseaseOutbreakEventFormData
    | RiskAssessmentGradingFormData
    | RiskAssessmentSummaryFormData
    | RiskAssessmentQuestionnaireFormData
    | IncidentManagementTeamMemberFormData
    | ActionPlanFormData
    | ResponseActionFormData;
