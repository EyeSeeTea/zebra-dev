import { Maybe } from "../../utils/ts-utils";
import { Id, Option } from "./Ref";

export type AlertsAndCaseForCasesData = {
    lastSyncTime: string;
    lastUpdated: string;
    nationalDiseaseOutbreakEventId: Id;
    alerts?: {
        alertId: string;
        eventDate: Maybe<string>;
        orgUnit: Maybe<string>;
        suspectedCases: string;
        probableCases: string;
        confirmedCases: string;
        deaths: string;
    }[];
    case?: {
        fileId: Id;
        fileName: string;
        fileType: string;
    };
    disease: string;
};

export function getOutbreakKey(options: {
    outbreakValue: Maybe<string>;
    suspectedDiseases: Option[];
}): string {
    const { outbreakValue, suspectedDiseases } = options;
    const diseaseName = suspectedDiseases.find(disease => disease.id === outbreakValue)?.name;

    if (!diseaseName) throw new Error(`Outbreak not found for ${outbreakValue}`);

    return diseaseName;
}
