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

export const UNKNOWN_DISEASE_CODE = "RTSL_ZEB_OS_DISEASE_UNKNOWN";
