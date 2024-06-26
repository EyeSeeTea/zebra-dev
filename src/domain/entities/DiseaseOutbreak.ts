import { Struct } from "./generic/Struct";
import { IncidentActionPlan } from "./incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "./incident-management-team/IncidentManagementTeam";
import { TeamMember } from "./incident-management-team/TeamMember";
import { OrgUnit } from "./OrgUnit";
import { CodedNamedRef, NamedRef } from "./Ref";
import { RiskAssessment } from "./risk-assessment/RiskAssessment";

type HazardType =
    | "Biological:Human"
    | "Biological:Animal"
    | "Chemical"
    | "Environmental"
    | "Unknown";

type IncidentStatusType = "Watch" | "Alert" | "Respond" | "Closed" | "Discarded";

type DateWithNarrative = {
    date: Date;
    narrative: string;
};

type Syndrome = CodedNamedRef;
type Disease = CodedNamedRef;
type NotificationSource = CodedNamedRef;

type DiseaseOutbreakEventAttrs = NamedRef & {
    created: Date;
    lastUpdated: Date;
    createdBy: TeamMember;
    hazardType: HazardType;
    mainSyndrome: Syndrome;
    suspectedDisease: Disease;
    notificationSource: NotificationSource;
    areasAffected: {
        provinces: OrgUnit[];
        districts: OrgUnit[];
    };
    incidentStatus: IncidentStatusType;
    emerged: DateWithNarrative;
    detected: DateWithNarrative;
    notified: DateWithNarrative;
    responseNarrative: string;
    incidentManager: TeamMember;
    notes: string;
    riskAssessments: RiskAssessment[];
    IncidentActionPlan: IncidentActionPlan;
    IncidentManagementTeam: IncidentManagementTeam;
};
/**
 * Note: DiseaseOutbreak represents Event in the Figma.
 * Not using event as it is a keyword and can also be confused with dhis event
 **/

export class DiseaseOutbreakEvent extends Struct<DiseaseOutbreakEventAttrs>() {
    static validateEventName() {
        //TO DO : Ensure event name is unique on event creation.
    }
}
