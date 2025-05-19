import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { Alert } from "../entities/alert/Alert";

export interface AlertSyncRepository {
    saveAlertSyncData(options: AlertSyncOptions): FutureData<void>;
}

export type AlertSyncOptions = {
    alert: Alert;
    outbreakKey: string;
    nationalDiseaseOutbreakEventId: Id;
};
