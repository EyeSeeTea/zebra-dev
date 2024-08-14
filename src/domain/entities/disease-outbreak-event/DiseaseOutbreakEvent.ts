import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { OrgUnit } from "../OrgUnit";
import { Id, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";

export const hazardTypes = [
    "Biological:Human",
    "Biological:Animal",
    "Chemical",
    "Environmental",
    "Unknown",
] as const;

export type HazardType = (typeof hazardTypes)[number];

export type IncidentStatusType = "Watch" | "Alert" | "Respond" | "Closed" | "Discarded";

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
    eventId: number;
    created: Date;
    lastUpdated: Date;
    createdByName: Maybe<string>;
    hazardType: HazardType;
    mainSyndromeCode: Id;
    suspectedDiseaseCode: Id;
    notificationSourceCode: Id;
    areasAffectedProvinceIds: Id[];
    areasAffectedDistrictIds: Id[];
    incidentStatus: IncidentStatusType;
    emerged: DateWithNarrative;
    detected: DateWithNarrative;
    notified: DateWithNarrative;
    earlyResponseActions: EarlyResponseActions; //TO DO : mandatory field
    incidentManagerName: string;
    notes: Maybe<string>;
};

type DiseaseOutbreakEventAttrs = DiseaseOutbreakEventBaseAttrs & {
    createdBy: Maybe<TeamMember>;
    mainSyndrome: NamedRef;
    suspectedDisease: NamedRef;
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
    static validateEventName() {
        //TO DO : Ensure event name is unique on event creation.
    }
}
