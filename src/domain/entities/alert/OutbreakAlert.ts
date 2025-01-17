import { Maybe } from "../../../utils/ts-utils";
import { NotificationOptions } from "../../repositories/NotificationRepository";
import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Alert } from "./Alert";

export type OutbreakDataType = "disease" | "hazard";

export type OutbreakData = {
    type: OutbreakDataType;
    value: Maybe<string>;
};

export type OutbreakAlert = {
    alert: Alert;
    dataSource: DataSource;
    outbreakData: OutbreakData;
    notificationOptions: NotificationOptions;
};

export type NotifiedAlert = {
    district: string;
    outbreak: string;
};
