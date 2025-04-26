import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { Code, Id, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError } from "../ValidationError";
import { Username } from "../User";

export enum NationalIncidentStatus {
    RTSL_ZEB_OS_INCIDENT_STATUS_WATCH = "RTSL_ZEB_OS_INCIDENT_STATUS_WATCH",
    RTSL_ZEB_OS_INCIDENT_STATUS_ALERT = "RTSL_ZEB_OS_INCIDENT_STATUS_ALERT",
    RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND = "RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND",
    RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED = "RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED",
    RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED = "RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED",
}

export enum DataSource {
    ND1 = "ND1",
    ND2 = "ND2",
}

export enum CasesDataSource {
    RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR = "RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR",
    RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF = "RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF",
}

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
    mainSyndromeCode: Maybe<Code>;
    suspectedDiseaseCode: Maybe<Code>;
    notificationSourceCode: Code;
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
