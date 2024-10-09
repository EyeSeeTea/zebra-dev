import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { alertOutbreakCodes } from "../consts/AlertConstants";
import { getValueFromMap } from "./DiseaseOutbreakMapper";
import { NotificationOptions } from "../../../domain/repositories/NotificationRepository";

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
