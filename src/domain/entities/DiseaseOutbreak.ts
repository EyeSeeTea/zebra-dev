//Note: DiseaseOutbreak represents Event in the Figma.
//Not using event as it is a keyword and can also be confused with dhis event
import { Struct } from "./generic/Struct";
import { IncidentActionPlan } from "./incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "./incident-management-team/IncidentManagementTeam";
import { TeamMember } from "./incident-management-team/TeamMember";
import { OrgUnit } from "./OrgUnit";
import { NamedRef, Option } from "./Ref";
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

interface DiseaseOutbreakAttrs extends NamedRef {
    created: Date;
    lastUpdated: Date;
    createdBy: TeamMember;
    hazardType: HazardType;
    mainSyndrome: Option;
    suspectedDisease: Option;
    notificationSource: Option;
    areasAffected: {
        provinces: OrgUnit[];
        districts: OrgUnit[];
    };
    incidentStatus: IncidentStatusType;
    dateEmerged: DateWithNarrative;
    dateDetected: DateWithNarrative;
    dateNotified: DateWithNarrative;
    responseNarrative: string;
    incidentManager: TeamMember;
    notes: string;
    //when should risk assessment, IAP,IMT be fetched? Only when the user clicks on the risk assessment tab?
    //Can we async get only 1 property in a class?
    riskAssessments: RiskAssessment[];
    //we need only response actions property from IncidentActionPlan. How can we map that?
    IncidentActionPlan: IncidentActionPlan;
    IncidentManagementTeam: IncidentManagementTeam;
}

export class DiseaseOutbreak extends Struct<DiseaseOutbreakAttrs>() {
    static validateEventName() {
        //Ensure event name is unique on event creation.
    }
}
