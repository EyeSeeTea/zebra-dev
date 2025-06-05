import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { alertOutbreakCodes } from "../consts/AlertConstants";
import { NotificationOptions } from "../../../domain/repositories/NotificationRepository";
import { AlertVerificationStatus } from "../../../domain/entities/alert/Alert";

export function mapTrackedEntityAttributesToNotificationOptions(
    trackedEntity: D2TrackerTrackedEntity
): NotificationOptions {
    const verificationStatus = getAlertValueFromMap(
        "verificationStatus",
        trackedEntity
    ) as AlertVerificationStatus;
    const incidentManager = getAlertValueFromMap("incidentManager", trackedEntity);
    const emergenceDate = getAlertValueFromMap("emergedDate", trackedEntity);
    const detectionDate = getAlertValueFromMap("detectedDate", trackedEntity);
    const notificationDate = getAlertValueFromMap("notifiedDate", trackedEntity);
    const emsId = getAlertValueFromMap("emsId", trackedEntity);
    const outbreakId = getAlertValueFromMap("outbreakId", trackedEntity);

    return {
        detectionDate: detectionDate,
        emergenceDate: emergenceDate,
        incidentManager: incidentManager,
        notificationDate: notificationDate,
        verificationStatus: verificationStatus,
        emsId: emsId,
        outbreakId: outbreakId,
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
