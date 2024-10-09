import { D2Api } from "@eyeseetea/d2-api/2.36";
import {
    NotificationOptions,
    NotificationRepository,
} from "../../domain/repositories/NotificationRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { UserGroup } from "../../domain/entities/UserGroup";
import { AlertData } from "../../domain/entities/alert/AlertData";
export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    notifyNationalWatchStaff(
        alertData: AlertData,
        outbreakName: string,
        userGroups: UserGroup[]
    ): FutureData<void> {
        const { notificationOptions } = alertData;

        return apiToFuture(
            this.api.messageConversations.post({
                subject: `New Outbreak Alert: ${outbreakName} in zm Zambia Ministry of Health`,
                text: buildNotificationText(outbreakName, notificationOptions),
                userGroups: userGroups,
            })
        ).flatMap(() => Future.success(undefined));
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
