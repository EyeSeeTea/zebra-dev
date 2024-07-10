import { CodedNamedRef, Option } from "../Ref";

export interface DiseaseOutbreakEventOption extends Option {
    type: "Syndrome" | "Disease" | "NotificationSource";
    values: CodedNamedRef[];
}

interface SyndromeOptions extends DiseaseOutbreakEventOption {
    type: "Syndrome";
}
interface DiseaseOptions extends DiseaseOutbreakEventOption {
    type: "Disease";
}
interface NotificationSourceOptions extends DiseaseOutbreakEventOption {
    type: "NotificationSource";
}
export type DiseaseOutbreakEventOptionsAttrs = {
    mainSyndromeOptions: SyndromeOptions;
    suspectedDiseaseOptions: DiseaseOptions;
    notificationSourceOptions: NotificationSourceOptions;
};
