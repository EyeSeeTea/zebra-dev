import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { Code, Id, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError } from "../ValidationError";
import _ from "../generic/Collection";
import { Username } from "../User";

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

export enum CasesDataSource {
    RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR = "RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR",
    RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF = "RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF",
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
    laboratoryConfirmation: Date;
    appropriateCaseManagement: DateWithNA;
    initiatePublicHealthCounterMeasures: DateWithNA;
    initiateRiskCommunication: DateWithNA;
    establishCoordination: DateWithNA;
    responseNarrative: string;
};

export type CaseData = {
    updatedBy: Username;
    orgUnit: Id;
    reportDate: string;
    suspectedCases: number;
    probableCases: number;
    confirmedCases: number;
    deaths: number;
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
    casesDataSource: CasesDataSource;
};

export type DiseaseOutbreakEventAttrs = DiseaseOutbreakEventBaseAttrs & {
    createdBy: Maybe<TeamMember>;
    mainSyndrome: Maybe<NamedRef>;
    suspectedDisease: Maybe<NamedRef>;
    notificationSource: Maybe<NamedRef>;
    incidentManager: Maybe<TeamMember>; //TO DO : make mandatory once form rules applied.
    riskAssessment: Maybe<RiskAssessment>;
    incidentActionPlan: Maybe<IncidentActionPlan>;
    incidentManagementTeam: Maybe<IncidentManagementTeam>;
    uploadedCasesData: Maybe<CaseData[]>;
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

    addUploadedCasesData(casesData: CaseData[]): DiseaseOutbreakEvent {
        return this._update({ uploadedCasesData: casesData });
    }
}
