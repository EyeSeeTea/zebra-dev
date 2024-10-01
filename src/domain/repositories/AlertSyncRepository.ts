import { FutureData } from "../../data/api-futures";
import { DataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, Option } from "../entities/Ref";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";

export interface AlertSyncRepository {
    saveAlertSyncData(options: AlertSyncOptions): FutureData<void>;
}

export type AlertSyncOptions = {
    alert: Alert;
    dataSource: DataSource;
    nationalDiseaseOutbreakEventId: Id;
    hazardTypeCode: Maybe<string>;
    suspectedDiseaseCode: Maybe<string>;
    hazardTypes: Option[];
    suspectedDiseases: Option[];
};
