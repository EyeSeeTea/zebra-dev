import { Ref } from "../entities/Ref";
import {
    NotificationOptions,
    NotificationRepository,
} from "../repositories/NotificationRepository";
import { FutureData } from "../../data/api-futures";

export class NotifyWatchStaffUseCase {
    constructor(private notificationRepository: NotificationRepository) {}

    public execute(
        outbreakKey: string,
        notificationData: NotificationOptions,
        userGroups: Ref[]
    ): FutureData<void> {
        return this.notificationRepository.save({
            subject: `New Outbreak Alert: ${outbreakKey} in zm Zambia Ministry of Health`,
            text: buildNotificationText(outbreakKey, notificationData),
            userGroups: userGroups,
        });
    }
}

function buildNotificationText(outbreakKey: string, notificationData: NotificationOptions): string {
    const { detectionDate, emergenceDate, incidentManager, notificationDate, verificationStatus } =
        notificationData;

    return `There has been a new Outbreak detected for ${outbreakKey} in zm Zambia Ministry of Health.

Please see the details of the outbreak below:

Emergence date: ${emergenceDate}
Detection Date :  ${detectionDate}
Notification Date :  ${notificationDate}
Incident Manager :  ${incidentManager}
Verification Status :  ${verificationStatus}`;
}
