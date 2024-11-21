import { Maybe } from "../../utils/ts-utils";
import { DataSource } from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "./Ref";
import { Option } from "./Ref";

export type CaseFile = {
    fileId?: Id;
    file: File;
};

export function getOutbreakKeyForCases(options: {
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
