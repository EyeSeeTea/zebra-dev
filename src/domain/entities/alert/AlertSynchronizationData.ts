import { Maybe } from "../../../utils/ts-utils";
import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, Option } from "../Ref";

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
    [key in "disease" | "hazard"]?: string;
};

export function getOutbreakKey(options: {
    dataSource: DataSource;
    outbreakValue: Maybe<string>;
    hazardTypes: Option[];
    suspectedDiseases: Option[];
}): string {
    const { dataSource, outbreakValue, hazardTypes, suspectedDiseases } = options;

    const diseaseName = suspectedDiseases.find(disease => disease.id === outbreakValue)?.name;
    const hazardName = hazardTypes.find(hazardType => hazardType.id === outbreakValue)?.name;

    if (!diseaseName && !hazardName) throw new Error(`Outbreak not found for ${outbreakValue}`);

    switch (dataSource) {
        case DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS:
            return hazardName ?? "";
        case DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS:
            return diseaseName ?? "";
    }
}
