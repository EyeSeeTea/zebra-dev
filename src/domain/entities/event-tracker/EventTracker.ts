import { Maybe } from "../../../utils/ts-utils";
import { Id, NamedRef } from "../Ref";

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

export type EventTracker = NamedRef & {
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
