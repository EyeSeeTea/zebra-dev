import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DataSource,
    IncidentStatus,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { AlertOptions } from "../../../domain/repositories/AlertRepository";
import { Maybe } from "../../../utils/ts-utils";
import { Option } from "../../../domain/entities/Ref";
import { alertOutbreakCodes } from "../consts/AlertConstants";
import { getValueFromMap } from "./DiseaseOutbreakMapper";

export function mapTrackedEntityAttributesToAlertOutbreak(
    nationalTrackedEntity: D2TrackerTrackedEntity,
    alertTrackedEntity: D2TrackerTrackedEntity
): AlertOptions {
    if (!nationalTrackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: AlertOptions = {
        eventId: nationalTrackedEntity.trackedEntity,
        dataSource: getValueFromMap("dataSource", nationalTrackedEntity) as DataSource,
        hazardTypeCode: getAlertValueFromMap("hazardType", alertTrackedEntity),
        suspectedDiseaseCode: getAlertValueFromMap("suspectedDisease", alertTrackedEntity),
        incidentStatus: getValueFromMap("incidentStatus", nationalTrackedEntity) as IncidentStatus,
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

export function getOutbreakKey(
    dataSource: DataSource,
    outbreak: Maybe<string>,
    hazardTypes: Option[],
    suspectedDiseases: Option[]
): string {
    const diseaseName = suspectedDiseases.find(disease => disease.id === outbreak)?.name;
    const hazardName = hazardTypes.find(hazardType => hazardType.id === outbreak)?.name;

    if (!diseaseName || !hazardName) throw new Error("Outbreak not found");

    switch (dataSource) {
        case DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS:
            return hazardName;
        case DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS:
            return diseaseName;
    }
}
