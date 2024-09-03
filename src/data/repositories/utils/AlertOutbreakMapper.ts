import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DataSource,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { AlertOptions } from "../../../domain/repositories/AlertRepository";
import { Maybe } from "../../../utils/ts-utils";
import { Option } from "../../../domain/entities/Ref";
import { NotificationOptions } from "../../../domain/repositories/NotificationRepository";
import { alertOutbreakCodes } from "../consts/DiseaseOutbreakConstants";

export function mapTrackedEntityAttributesToAlertOutbreak(
    nationalTrackedEntity: D2TrackerTrackedEntity,
    alertTrackedEntity: D2TrackerTrackedEntity
): AlertOptions {
    if (!nationalTrackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: AlertOptions = {
        eventId: nationalTrackedEntity.trackedEntity,
        dataSource: getValueFromMap("dataSource", nationalTrackedEntity) as DataSource,
        hazardTypeCode: getValueFromMap("hazardType", alertTrackedEntity),
        suspectedDiseaseCode: getValueFromMap("suspectedDisease", alertTrackedEntity),
        incidentStatus: getValueFromMap(
            "incidentStatus",
            nationalTrackedEntity
        ) as IncidentStatusType,
    };

    return diseaseOutbreak;
}

export function getValueFromMap(
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
): Maybe<string> {
    switch (dataSource) {
        case "EBS":
            return hazardTypes.find(hazardType => hazardType.id === outbreak)?.name;
        case "IBS":
            return suspectedDiseases.find(disease => disease.id === outbreak)?.name;
    }
}

export function getNotificationOptionsFromTrackedEntity(
    alertTrackedEntity: D2TrackerTrackedEntity
): NotificationOptions {
    const verificationStatus = getValueFromMap("verificationStatus", alertTrackedEntity);
    const incidentManager = getValueFromMap("incidentManager", alertTrackedEntity);
    const emergenceDate = getValueFromMap("emergedDate", alertTrackedEntity);
    const detectionDate = getValueFromMap("detectedDate", alertTrackedEntity);
    const notificationDate = getValueFromMap("notifiedDate", alertTrackedEntity);

    return {
        detectionDate: detectionDate,
        emergenceDate: emergenceDate,
        incidentManager: incidentManager,
        notificationDate: notificationDate,
        verificationStatus: verificationStatus,
    };
}
