import { NotificationOptions } from "../../repositories/NotificationRepository";
import { Alert } from "./Alert";

export type OutbreakAlert = {
    alert: Alert;
    notificationOptions: NotificationOptions;
};

export type NotifiedAlert = {
    district: string;
    outbreak: string;
};
