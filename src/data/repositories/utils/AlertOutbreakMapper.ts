import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { AlertOptions } from "../../../domain/repositories/AlertRepository";
import { Maybe } from "../../../utils/ts-utils";
import { Option } from "../../../domain/entities/Ref";
import { alertOutbreakCodes } from "../consts/AlertConstants";
import { getValueFromMap } from "./DiseaseOutbreakMapper";
import {
    dataSourceMap,
    diseaseOutbreakCodes,
    incidentStatusMap,
} from "../consts/DiseaseOutbreakConstants";

export function mapTrackedEntityAttributesToAlertOptions(
    nationalTrackedEntity: D2TrackerTrackedEntity,
    alertTrackedEntity: D2TrackerTrackedEntity
): AlertOptions {
    if (!nationalTrackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const fromDiseaseOutbreakMap = (
        key: keyof typeof diseaseOutbreakCodes,
        trackedEntity: D2TrackerTrackedEntity
    ) => getValueFromMap(key, trackedEntity);

    const fromAlertOutbreakMap = (
        key: keyof typeof alertOutbreakCodes,
        trackedEntity: D2TrackerTrackedEntity
    ) => getAlertValueFromMap(key, trackedEntity);

    const dataSource = dataSourceMap[fromDiseaseOutbreakMap("dataSource", nationalTrackedEntity)];
    const incidentStatus =
        incidentStatusMap[fromDiseaseOutbreakMap("incidentStatus", nationalTrackedEntity)];

    if (!dataSource || !incidentStatus) throw new Error("Data source or incident status not valid");

    const diseaseOutbreak: AlertOptions = {
        eventId: nationalTrackedEntity.trackedEntity,
        dataSource: dataSource,
        hazardTypeCode: fromAlertOutbreakMap("hazardType", alertTrackedEntity),
        suspectedDiseaseCode: fromAlertOutbreakMap("suspectedDisease", alertTrackedEntity),
        incidentStatus: incidentStatus,
    };

    return diseaseOutbreak;
}

export function mapAlertOutbreakToTrackedEntity() {}

export function getAlertValueFromMap(
    key: keyof typeof alertOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return (
        trackedEntity.attributes?.find(attribute => attribute.code === alertOutbreakCodes[key])
            ?.value ?? ""
    );
}

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
