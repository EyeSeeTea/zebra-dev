import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../incident-management-team/TeamMember";
import { OrgUnit } from "../OrgUnit";
import { CodedNamedRef } from "../Ref";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DiseaseOutbreakEventOptions = {
    hazardTypes: CodedNamedRef[];
    mainSyndromes: CodedNamedRef[];
    suspectedDiseases: CodedNamedRef[];
    notificationSources: CodedNamedRef[];
    organisationUnits: OrgUnit[];
    incidentStatus: CodedNamedRef[];
    teamMembers: TeamMember[];
};

export type DiseaseOutbreakEventLables = {
    errors: Record<string, string>;
};

export type DiseaseOutbreakEventWithOptions = {
    diseaseOutbreakEvent: Maybe<DiseaseOutbreakEventBaseAttrs>;
    options: DiseaseOutbreakEventOptions;
    labels: DiseaseOutbreakEventLables;
};
