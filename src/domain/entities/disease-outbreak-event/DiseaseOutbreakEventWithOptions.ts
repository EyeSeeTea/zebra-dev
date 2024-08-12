import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../incident-management-team/TeamMember";
import { OrgUnit } from "../OrgUnit";
import { Option } from "../Ref";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DiseaseOutbreakEventOptions = {
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    organisationUnits: OrgUnit[];
    incidentStatus: Option[];
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
