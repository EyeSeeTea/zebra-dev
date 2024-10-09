import { FutureData } from "../../data/api-futures";
import { AlertData } from "../entities/alert/AlertData";
import { UserGroup } from "../entities/UserGroup";

export interface NotificationRepository {
    notifyNationalWatchStaff(
        alertData: AlertData,
        outbreakName: string,
        userGroups: UserGroup[]
    ): FutureData<void>;
}

export type NotificationOptions = {
    detectionDate: string;
    emergenceDate: string;
    incidentManager: string;
    notificationDate: string;
    verificationStatus: string;
};
