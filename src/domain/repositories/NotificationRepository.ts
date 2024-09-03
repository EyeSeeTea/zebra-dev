import { FutureData } from "../../data/api-futures";
import { Ref } from "../entities/Ref";

export interface NotificationRepository {
    save(notification: Notification): FutureData<void>;
}

export type Notification = {
    subject: string;
    text: string;
    userGroups: Ref[];
};

export type NotificationOptions = {
    detectionDate: string;
    emergenceDate: string;
    incidentManager: string;
    notificationDate: string;
    verificationStatus: string;
};
