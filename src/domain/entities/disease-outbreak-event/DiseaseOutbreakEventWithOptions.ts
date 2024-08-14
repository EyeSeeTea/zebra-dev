import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../incident-management-team/TeamMember";
import { Option } from "../Ref";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DiseaseOutbreakEventOptions = {
    dataSources: Option[];
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
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
