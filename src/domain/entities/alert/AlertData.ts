import { Maybe } from "../../../utils/ts-utils";
import { NotificationOptions } from "../../repositories/NotificationRepository";
import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Alert } from "./Alert";

export type OutbreakData = {
    type: "disease" | "hazard";
    value: Maybe<string>;
};

export type AlertData = {
    alert: Alert;
    dataSource: DataSource;
    outbreakData: OutbreakData;
    notificationOptions: NotificationOptions;
};
