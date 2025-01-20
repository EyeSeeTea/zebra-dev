import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Id, Option } from "../entities/Ref";
import { Alert } from "../entities/alert/Alert";
import { DataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface AlertSyncRepository {
    saveAlertSyncData(options: AlertSyncOptions): FutureData<void>;
}

export type AlertSyncOptions = {
    alert: Alert;
    dataSource: DataSource;
    outbreakValue: Maybe<string>;
    nationalDiseaseOutbreakEventId: Id;
    hazardTypes: Option[];
    suspectedDiseases: Option[];
};
