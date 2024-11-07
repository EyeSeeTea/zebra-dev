import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { Code, NamedRef } from "../Ref";
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

export type DateWithNarrative = {
    date: Date;
    narrative: string;
};

type DateWithNA = {
    date: Maybe<Date>;
    na: Maybe<boolean>;
};

export type EarlyResponseActions = {
    initiateInvestigation: Date;
    conductEpidemiologicalAnalysis: Date;
    laboratoryConfirmation: Date;
    appropriateCaseManagement: DateWithNA;
    initiatePublicHealthCounterMeasures: DateWithNA;
    initiateRiskCommunication: DateWithNA;
    establishCoordination: DateWithNA;
    responseNarrative: string;
};

export type DiseaseOutbreakEventBaseAttrs = NamedRef & {
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    created?: Date;
    lastUpdated?: Date;
    createdByName: Maybe<string>;
    dataSource: DataSource;
    hazardType: Maybe<HazardType>;
    mainSyndromeCode: Maybe<Code>;
    suspectedDiseaseCode: Maybe<Code>;
    notificationSourceCode: Code;
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
    incidentManager: Maybe<TeamMember>; //TO DO : make mandatory once form rules applied.
    riskAssessment: Maybe<RiskAssessment>;
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
