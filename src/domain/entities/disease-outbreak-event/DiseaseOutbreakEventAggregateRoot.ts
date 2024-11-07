import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { Id } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError } from "../ValidationError";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DiseaseOutbreakEventAggregateRootBaseAttrs = DiseaseOutbreakEventBaseAttrs;

export type IncidentManagementTeamRole = {
    id: Id;
    roleId: Id;
    reportsToUsername: Maybe<string>;
};

type IncidentManagementTeamMember = {
    username: string;
    teamRoles: IncidentManagementTeamRole[];
};

interface IncidentManagementTeamAttrsInAggregateRoot {
    teamHierarchy: IncidentManagementTeamMember[];
    lastUpdated: Maybe<Date>;
}

export class IncidentManagementTeamInAggregateRoot extends Struct<IncidentManagementTeamAttrsInAggregateRoot>() {}

export type DiseaseOutbreakEventAggregateRootAttrs = DiseaseOutbreakEventAggregateRootBaseAttrs & {
    riskAssessment: Maybe<RiskAssessment>;
    incidentActionPlan: Maybe<IncidentActionPlan>;
    incidentManagementTeam: Maybe<IncidentManagementTeamInAggregateRoot>;
};

export class DiseaseOutbreakEventAggregateRoot extends Struct<DiseaseOutbreakEventAggregateRootAttrs>() {
    //TODO: Add required validations if exists:
    static validate(_data: DiseaseOutbreakEventAggregateRootAttrs): ValidationError[] {
        return [];
    }
}
