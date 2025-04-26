import { Maybe } from "../../utils/ts-utils";
import { TeamMember } from "./incident-management-team/TeamMember";
import { Id, Option } from "./Ref";
import { Rule } from "./Rule";
import { DiseaseOutbreakEvent } from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { RiskAssessmentGrading } from "./risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentSummary } from "./risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentQuestionnaire } from "./risk-assessment/RiskAssessmentQuestionnaire";
import { ActionPlanAttrs } from "./incident-action-plan/ActionPlan";
import { ResponseAction } from "./incident-action-plan/ResponseAction";
import { IncidentManagementTeam } from "./incident-management-team/IncidentManagementTeam";
import { Role } from "./incident-management-team/Role";
import { Resource } from "./resources/Resource";
import { OrgUnit } from "./OrgUnit";

export type DiseaseOutbreakEventOptions = {
    alertDataSources: Option[];
    dataSources: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    incidentManagers: TeamMember[];
    casesDataSource: Option[];
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

export type ResourceOptions = {
    resourceType: Option[];
    resourceFolder: Option[];
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
    type: "disease-outbreak-event" | "disease-outbreak-event-case-data";
    entity: Maybe<DiseaseOutbreakEvent>;
    options: DiseaseOutbreakEventOptions;
    orgUnits: OrgUnit[];
    caseDataFileTemplete: Maybe<File>;
    uploadedCasesDataFile: Maybe<File>;
    uploadedCasesDataFileId: Maybe<Id>;
    hasInitiallyCasesDataFile: boolean;
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

export type ActionPlanFormData = BaseFormData & {
    type: "incident-action-plan";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: Maybe<ActionPlanAttrs>;
    options: IncidentActionPlanOptions;
};

export type ResponseActionFormData = BaseFormData & {
    type: "incident-response-actions";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: ResponseAction[];
    options: IncidentResponseActionOptions;
};

export type SingleResponseActionFormData = BaseFormData & {
    type: "incident-response-action";
    eventTrackerDetails: DiseaseOutbreakEvent;
    entity: ResponseAction;
    options: IncidentResponseActionOptions;
};

export type ResourceFormData = BaseFormData & {
    type: "resource";
    entity: Maybe<Resource>;
    uploadedResourceFile: Maybe<File>;
    options: ResourceOptions;
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

export type ConfigurableForm =
    | DiseaseOutbreakEventFormData
    | RiskAssessmentGradingFormData
    | RiskAssessmentSummaryFormData
    | RiskAssessmentQuestionnaireFormData
    | ActionPlanFormData
    | ResponseActionFormData
    | SingleResponseActionFormData
    | IncidentManagementTeamMemberFormData
    | ResourceFormData;
