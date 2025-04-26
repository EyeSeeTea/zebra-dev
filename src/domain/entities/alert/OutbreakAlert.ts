import { Maybe } from "../../../utils/ts-utils";
import { NotificationOptions } from "../../repositories/NotificationRepository";
import { Alert, AlertDataSource } from "./Alert";

export type OutbreakDataType = "disease";

export type OutbreakData = {
    type: OutbreakDataType;
    value: Maybe<string>;
};

export type OutbreakAlert = {
    alert: Alert;
    dataSource: AlertDataSource;
    outbreakData: OutbreakData;
    notificationOptions: NotificationOptions;
};

export type NotifiedAlert = {
    district: string;
    outbreak: string;
};
