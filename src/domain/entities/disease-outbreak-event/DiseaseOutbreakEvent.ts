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

export type DiseaseOutbreakEventAttrs = NamedRef & {
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
    static createEmpty(): DiseaseOutbreakEvent {
        return new DiseaseOutbreakEvent({
            // Hardcoded values for DiseaseOutbreakEvent properties
            id: "",
            name: "",
            created: new Date(""),
            lastUpdated: new Date(""),
            createdBy: undefined,
            hazardType: "" as HazardType,
            mainSyndrome: {
                id: "",
                code: "",
                name: "",
            }, //TO DO : Option set not yet created
            suspectedDisease: {
                id: "",
                code: "",
                name: "",
            }, //TO DO : Option set not yet created
            notificationSource: {
                id: "",
                code: "",
                name: "",
            }, //TO DO : Option set not yet created
            areasAffectedProvinces: [
                {
                    id: "",
                    code: "",
                    name: "",
                },
            ],
            areasAffectedDistricts: [
                {
                    id: "",
                    code: "",
                    name: "",
                },
            ],
            incidentStatus: "" as IncidentStatusType,
            emerged: {
                date: new Date(""),
                narrative: "",
            },
            detected: {
                date: new Date(""),
                narrative: "",
            },
            notified: {
                date: new Date(""),
                narrative: "",
            },
            incidentManager: new TeamMember({
                id: "",
                name: "",
                phone: undefined,
                email: undefined,
                status: undefined,
                role: undefined,
                photo: undefined,
            }),
            earlyResponseActions: {
                initiateInvestigation: new Date(""),
                conductEpidemiologicalAnalysis: new Date(""),
                laboratoryConfirmation: {
                    date: new Date(""),
                    na: false,
                },
                appropriateCaseManagement: {
                    date: new Date(""),
                    na: false,
                },
                initiatePublicHealthCounterMeasures: {
                    date: new Date(""),
                    na: false,
                },
                initiateRiskCommunication: {
                    date: new Date(""),
                    na: false,
                },
                establishCoordination: new Date(""),
                responseNarrative: "",
            },
            notes: "",
            riskAssessments: undefined,
            incidentActionPlan: undefined,
            incidentManagementTeam: undefined,
        });
    }
    static isKeyOfDiseaseOutbreakEvent(key: string): key is keyof DiseaseOutbreakEvent {
        return key in DiseaseOutbreakEvent.prototype;
    }
    static validateEventName() {
        //TO DO : Ensure event name is unique on event creation.
    }
}
