import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { OrgUnit } from "../OrgUnit";
import { Code, Id, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError } from "../ValidationError";

export const hazardTypes = [
    "Biological:Human",
    "Biological:Animal",
    "Biological:HumanAndAnimal",
    "Chemical",
    "Environmental",
    "Unknown",
] as const;

export type HazardType = (typeof hazardTypes)[number];

export enum NationalIncidentStatus {
    RTSL_ZEB_OS_INCIDENT_STATUS_WATCH = "RTSL_ZEB_OS_INCIDENT_STATUS_WATCH",
    RTSL_ZEB_OS_INCIDENT_STATUS_ALERT = "RTSL_ZEB_OS_INCIDENT_STATUS_ALERT",
    RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND = "RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND",
    RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED = "RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED",
    RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED = "RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED",
}

export enum DataSource {
    RTSL_ZEB_OS_DATA_SOURCE_IBS = "RTSL_ZEB_OS_DATA_SOURCE_IBS",
    RTSL_ZEB_OS_DATA_SOURCE_EBS = "RTSL_ZEB_OS_DATA_SOURCE_EBS",
}

type DateWithNarrative = {
    date: Date;
    narrative: string;
};

type DateWithNA = {
    date: Maybe<Date>;
    na: Maybe<boolean>;
};

type EarlyResponseActions = {
    initiateInvestigation: Date;
    conductEpidemiologicalAnalysis: Date;
    laboratoryConfirmation: DateWithNA;
    appropriateCaseManagement: DateWithNA;
    initiatePublicHealthCounterMeasures: DateWithNA;
    initiateRiskCommunication: DateWithNA;
    establishCoordination: Date;
    responseNarrative: string;
};

export type DiseaseOutbreakEventBaseAttrs = NamedRef & {
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    created: Date;
    lastUpdated: Date;
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

export type DiseaseOutbreakEventAttrs = DiseaseOutbreakEventBaseAttrs & {
    createdBy: Maybe<TeamMember>;
    mainSyndrome: Maybe<NamedRef>;
    suspectedDisease: Maybe<NamedRef>;
    notificationSource: NamedRef;
    areasAffectedProvinces: OrgUnit[];
    areasAffectedDistricts: OrgUnit[];
    incidentManager: Maybe<TeamMember>; //TO DO : make mandatory once form rules applied.
    riskAssessments: Maybe<RiskAssessment[]>;
    incidentActionPlan: Maybe<IncidentActionPlan>;
    incidentManagementTeam: Maybe<IncidentManagementTeam>;
};

/**
 * Note: DiseaseOutbreakEvent represents Event in the Figma.
 * Not using event as it is a keyword and can also be confused with dhis event
 **/

export class DiseaseOutbreakEvent extends Struct<DiseaseOutbreakEventAttrs>() {
    //TODO: Add required validations if exists:
    static validate(_data: DiseaseOutbreakEventBaseAttrs): ValidationError[] {
        return [];
    }
}
