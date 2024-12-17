import { D2Api } from "@eyeseetea/d2-api/2.36";
import {
    NotificationOptions,
    NotificationRepository,
} from "../../domain/repositories/NotificationRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { UserGroup } from "../../domain/entities/UserGroup";
import { OutbreakAlert } from "../../domain/entities/alert/OutbreakAlert";
import i18n from "../../utils/i18n";
import { verificationStatusCodeMap } from "./consts/AlertConstants";
import { assertOrError } from "./utils/AssertOrError";

export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    notifyNationalWatchStaff(
        alertData: OutbreakAlert,
        outbreakName: string,
        userGroups: UserGroup[]
    ): FutureData<void> {
        const { alert, notificationOptions } = alertData;

        return this.getDistrictName(alert.district).flatMap(districtName => {
            return apiToFuture(
                this.api.messageConversations.post({
                    subject: `New Outbreak Alert: ${outbreakName} in ${districtName}`,
                    text: buildNotificationText(outbreakName, districtName, notificationOptions),
                    userGroups: userGroups,
                })
            ).flatMap(() => Future.success(undefined));
        });
    }

    private getDistrictName(districtId: string): FutureData<string> {
        return apiToFuture(
            this.api.metadata.get({
                organisationUnits: {
                    fields: {
                        name: true,
                    },
                    filter: {
                        id: {
                            eq: districtId,
                        },
                    },
                },
            })
        )
            .flatMap(response => assertOrError(response.organisationUnits[0], "Organisation Unit"))
            .map(district => district.name);
    }
}

function buildNotificationText(
    outbreakKey: string,
    district: string,
    notificationData: NotificationOptions
): string {
    const {
        emsId,
        outbreakId,
        detectionDate,
        emergenceDate,
        incidentManager,
        notificationDate,
        verificationStatus: verificationStatusCode,
    } = notificationData;
    const verificationStatus = verificationStatusCodeMap[verificationStatusCode] ?? "";

    return i18n.t(`There has been a new Outbreak detected for ${outbreakKey} in ${district}.

Please see the details of the outbreak below:

EMS ID: ${emsId}
Outbreak ID: ${outbreakId}
Emergence date: ${emergenceDate}
Detection Date :  ${detectionDate}
Notification Date :  ${notificationDate}
Incident Manager :  ${incidentManager}
Verification Status :  ${verificationStatus}`);
}
