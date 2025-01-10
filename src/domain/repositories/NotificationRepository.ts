import { FutureData } from "../../data/api-futures";
import { AlertVerificationStatus } from "../entities/alert/Alert";
import { OutbreakAlert } from "../entities/alert/OutbreakAlert";
import { UserGroup } from "../entities/UserGroup";

export interface NotificationRepository {
    notifyNationalWatchStaff(
        alertData: OutbreakAlert,
        outbreakName: string,
        userGroups: UserGroup[]
    ): FutureData<void>;
}

export type NotificationOptions = {
    detectionDate: string;
    emergenceDate: string;
    emsId: string;
    incidentManager: string;
    notificationDate: string;
    outbreakId: string;
    verificationStatus: AlertVerificationStatus;
};
