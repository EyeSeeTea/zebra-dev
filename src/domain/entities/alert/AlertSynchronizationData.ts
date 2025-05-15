import { Maybe } from "../../../utils/ts-utils";
import { OutbreakValueCode } from "../../repositories/AlertRepository";
import { Id, Option } from "../Ref";
import { OutbreakDataType } from "./OutbreakAlert";

export type AlertSynchronizationData = {
    lastSyncTime: string;
    type: string;
    nationalDiseaseOutbreakEventId: Id;
    alerts: {
        alertId: string;
        eventDate: Maybe<string>;
        orgUnit: Maybe<string>;
        suspectedCases: string;
        probableCases: string;
        confirmedCases: string;
        deaths: string;
    }[];
} & {
    [key in OutbreakDataType]?: string;
};

export function getOutbreakKey(options: {
    outbreakValue: Maybe<OutbreakValueCode>;
    suspectedDiseases: Option[];
}): string {
    const { outbreakValue, suspectedDiseases } = options;
    const diseaseName = suspectedDiseases.find(disease => disease.id === outbreakValue)?.name;

    if (!diseaseName) throw new Error(`Outbreak not found for ${outbreakValue}`);

    return diseaseName ?? "";
}
