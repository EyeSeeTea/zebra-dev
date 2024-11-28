import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { getAlertValueFromMap } from "./AlertOutbreakMapper";
import { NotificationOptions } from "../../../domain/repositories/NotificationRepository";
import { getValueFromMap } from "./DiseaseOutbreakMapper";

export function getNotificationOptionsFromTrackedEntity(
    alertTrackedEntity: D2TrackerTrackedEntity
): NotificationOptions {
    const verificationStatus = getAlertValueFromMap("verificationStatus", alertTrackedEntity);
    const incidentManager = getAlertValueFromMap("incidentManager", alertTrackedEntity);
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
