import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Ref } from "../entities/Ref";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { FutureData } from "../../data/api-futures";
import { getValueFromMap } from "../../data/repositories/utils/AlertOutbreakMapper";

export class NotifyWatchStaffUseCase {
    constructor(private notificationRepository: NotificationRepository) {}

    public execute(
        outbreak: string,
        trackedEntity: D2TrackerTrackedEntity,
        userGroups: Ref[]
    ): FutureData<void> {
        return this.notificationRepository.save({
            subject: `New Outbreak Alert: ${outbreak} in zm Zambia Ministry of Health`,
            text: buildNotificationText(trackedEntity, outbreak),
            userGroups: userGroups,
        });
    }
}

function buildNotificationText(
    alertTrackedEntity: D2TrackerTrackedEntity,
    outbreak: string
): string {
    const verificationStatus = getValueFromMap("verificationStatus", alertTrackedEntity);
    const incidentManager = getValueFromMap("incidentManager", alertTrackedEntity);
    const emergenceDate = getValueFromMap("emergedDate", alertTrackedEntity);
    const detectionDate = getValueFromMap("detectedDate", alertTrackedEntity);
    const notificationDate = getValueFromMap("notifiedDate", alertTrackedEntity);

    return `There has been a new Outbreak detected for ${outbreak} in zm Zambia Ministry of Health.

Please see the details of the outbreak below:

Emergence date: ${emergenceDate}
Detection Date :  ${detectionDate}
Notification Date :  ${notificationDate}
Incident Manager :  ${incidentManager}
Verification Status :  ${verificationStatus}`;
}
