import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Alert } from "./Alert";

export type AlertData = {
    alert: Alert;
    dataSource: DataSource;
    outbreakData: {
        id: string;
        value: string;
    };
};
