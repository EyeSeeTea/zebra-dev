import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { Code, Id, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError } from "../ValidationError";
import {
    DataSource,
    DateWithNarrative,
    EarlyResponseActions,
    HazardType,
    NationalIncidentStatus,
} from "./DiseaseOutbreakEvent";

export type DiseaseOutbreakEventAggregateRootBaseAttrs = NamedRef & {
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    created?: Date;
    lastUpdated?: Date;
    createdByName: Maybe<string>;
    dataSource: DataSource;
    hazardType: Maybe<HazardType>;
    mainSyndromeCode: Maybe<Code>;
    suspectedDiseaseCode: Maybe<Code>;
    notificationSourceCode: Code;
    areasAffectedProvinceIds: Id[];
    areasAffectedDistrictIds: Id[];
    incidentStatus: NationalIncidentStatus;
    emerged: DateWithNarrative;
    detected: DateWithNarrative;
    notified: DateWithNarrative;
    earlyResponseActions: EarlyResponseActions;
    incidentManagerName: string;
    notes: Maybe<string>;
};

type IncidentManagementTeamMemberUsername = string;

interface IncidentManagementTeamAttrsInAggregateRoot {
    teamHierarchy: IncidentManagementTeamMemberUsername[];
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
