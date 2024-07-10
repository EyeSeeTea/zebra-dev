import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { OrgUnit } from "../OrgUnit";
import { CodedNamedRef, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";

export type HazardType =
    | "Biological:Human"
    | "Biological:Animal"
    | "Chemical"
    | "Environmental"
    | "Unknown";

export type IncidentStatusType = "Watch" | "Alert" | "Respond" | "Closed" | "Discarded";

type DateWithNarrative = {
    date: Date;
    narrative: string;
};

type DateWithNA = {
    date: Date;
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

type DiseaseOutbreakEventAttrs = NamedRef & {
    created: Date;
    lastUpdated: Date;
    createdBy: Maybe<TeamMember>;
    hazardType: HazardType;
    mainSyndrome: CodedNamedRef;
    suspectedDisease: CodedNamedRef;
    notificationSource: CodedNamedRef;
    areasAffectedProvinces: OrgUnit[];
    areasAffectedDistricts: OrgUnit[];
    incidentStatus: IncidentStatusType;
    emerged: DateWithNarrative;
    detected: DateWithNarrative;
    notified: DateWithNarrative;
    earlyResponseActions: EarlyResponseActions; //TO DO : mandatory field
    incidentManager: TeamMember;
    notes: Maybe<string>;
    riskAssessments: Maybe<RiskAssessment[]>;
    incidentActionPlan: Maybe<IncidentActionPlan>;
    incidentManagementTeam: Maybe<IncidentManagementTeam>;
};
/**
 * Note: DiseaseOutbreakEvent represents Event in the Figma.
 * Not using event as it is a keyword and can also be confused with dhis event
 **/

export class DiseaseOutbreakEvent extends Struct<DiseaseOutbreakEventAttrs>() {
    static validateEventName() {
        //TO DO : Ensure event name is unique on event creation.
    }
}
