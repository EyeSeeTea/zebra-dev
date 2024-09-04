import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../incident-management-team/TeamMember";
import { Option } from "../Ref";
import { ValidationErrorKey } from "../ValidationError";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DiseaseOutbreakEventOptions = {
    hazardTypes: Option[];
    mainSyndromes: Option[];
    suspectedDiseases: Option[];
    notificationSources: Option[];
    incidentStatus: Option[];
    teamMembers: TeamMember[];
};

export type DiseaseOutbreakEventLabels = {
    errors: Record<ValidationErrorKey, string>;
};

export type DiseaseOutbreakEventWithOptions = {
    diseaseOutbreakEvent: Maybe<DiseaseOutbreakEventBaseAttrs>;
    options: DiseaseOutbreakEventOptions;
    labels: DiseaseOutbreakEventLabels;
};
