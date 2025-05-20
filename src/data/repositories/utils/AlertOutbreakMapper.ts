import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { alertOutbreakCodes } from "../consts/AlertConstants";
import { NotificationOptions } from "../../../domain/repositories/NotificationRepository";
import { OutbreakDataType } from "../../../domain/entities/alert/OutbreakAlert";
import { Id } from "../../../domain/entities/Ref";
import { RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID } from "../consts/DiseaseOutbreakConstants";
import { AlertVerificationStatus } from "../../../domain/entities/alert/Alert";

export function mapTrackedEntityAttributesToNotificationOptions(
    trackedEntity: D2TrackerTrackedEntity
): NotificationOptions {
    const verificationStatus = getAlertValueFromMap(
        "verificationStatus",
        trackedEntity
    ) as AlertVerificationStatus;
    const incidentManager = getAlertValueFromMap("incidentManager", trackedEntity);
    const emergenceDate = getValueFromMap("emergedDate", trackedEntity);
    const detectionDate = getValueFromMap("detectedDate", trackedEntity);
    const notificationDate = getValueFromMap("notifiedDate", trackedEntity);
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

export const outbreakTEAMapping: Record<OutbreakDataType, TrackedEntityAttributeId> = {
    disease: RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
};

type TrackedEntityAttributeId = Id;

export function getValueFromMap(
    key: keyof typeof alertOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === alertOutbreakCodes[key])?.value ?? "";
}
