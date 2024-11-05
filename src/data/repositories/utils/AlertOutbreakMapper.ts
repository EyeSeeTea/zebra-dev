import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { alertOutbreakCodes } from "../consts/AlertConstants";
import { getValueFromMap } from "./DiseaseOutbreakMapper";
import { NotificationOptions } from "../../../domain/repositories/NotificationRepository";
import { OutbreakDataType } from "../../../domain/entities/alert/OutbreakAlert";
import { Id } from "../../../domain/entities/Ref";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
} from "../consts/DiseaseOutbreakConstants";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export function mapTrackedEntityAttributesToNotificationOptions(
    trackedEntity: D2TrackerTrackedEntity
): NotificationOptions {
    const verificationStatus = getAlertValueFromMap("verificationStatus", trackedEntity);
    const incidentManager = getAlertValueFromMap("incidentManager", trackedEntity);
    const emergenceDate = getValueFromMap("emergedDate", trackedEntity);
    const detectionDate = getValueFromMap("detectedDate", trackedEntity);
    const notificationDate = getValueFromMap("notifiedDate", trackedEntity);

    return {
        detectionDate: detectionDate,
        emergenceDate: emergenceDate,
        incidentManager: incidentManager,
        notificationDate: notificationDate,
        verificationStatus: verificationStatus,
    };
}

export function getAlertValueFromMap(
    key: keyof typeof alertOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return (
        trackedEntity.attributes?.find(attribute => attribute.code === alertOutbreakCodes[key])
            ?.value ?? ""
    );
}

export const outbreakTEAMapping: Record<OutbreakDataType, TrackedEntityAttributeId> = {
    disease: RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    hazard: RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
};

export const outbreakDataSourceMapping: Record<DataSource, OutbreakDataType> = {
    [DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS]: "disease",
    [DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS]: "hazard",
};

type TrackedEntityAttributeId = Id;
