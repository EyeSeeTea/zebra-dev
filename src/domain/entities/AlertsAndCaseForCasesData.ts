import { Maybe } from "../../utils/ts-utils";
import { Code, Id, Option } from "./Ref";

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
    disease?: string;
};

export function getOutbreakKey(options: {
    diseaseCode: Maybe<Code>;
    diseaseOptions: Option[];
}): string {
    const { diseaseCode, diseaseOptions } = options;
    const diseaseName = diseaseOptions.find(disease => disease.id === diseaseCode)?.name;

    if (!diseaseName) throw new Error(`Outbreak not found for ${diseaseCode}`);

    return diseaseName;
}
