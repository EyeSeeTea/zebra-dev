import { Maybe } from "../../../utils/ts-utils";
import { NotificationOptions } from "../../repositories/NotificationRepository";
import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../Ref";
import { Alert } from "./Alert";

export type OutbreakData = {
    id: Id; // disease or hazard
    value: Maybe<string>; // disease or hazard code
};

export type AlertData = {
    alert: Alert;
    dataSource: DataSource;
    outbreakData: OutbreakData;
    notificationOptions: NotificationOptions;
};
