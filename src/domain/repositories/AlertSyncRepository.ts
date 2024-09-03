import { FutureData } from "../../data/api-futures";
import { DataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";
import { Maybe } from "../../utils/ts-utils";
import { AlertData } from "../../data/repositories/AlertSyncDataStoreRepository";

export interface AlertSyncRepository {
    saveAlertSyncData(options: AlertSyncOptions): FutureData<void>;
}

export type AlertSyncOptions = {
    alertData: AlertData["alert"];
    dataSource: DataSource;
    eventId: Id;
    hazardTypeCode: Maybe<string>;
    suspectedDiseaseCode: Maybe<string>;
};
