import { Maybe } from "../../../utils/ts-utils";
import { NotificationOptions } from "../../repositories/NotificationRepository";
import { Alert } from "./Alert";

export type OutbreakDataType = "disease";

export type OutbreakData = {
    type: OutbreakDataType;
    value: Maybe<string>;
};

export type OutbreakAlert = {
    alert: Alert;
    outbreakData: OutbreakData;
    notificationOptions: NotificationOptions;
};

export type NotifiedAlert = {
    district: string;
    outbreak: string;
};
