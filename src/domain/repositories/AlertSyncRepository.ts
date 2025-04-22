import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Id, Option } from "../entities/Ref";
import { Alert } from "../entities/alert/Alert";

export interface AlertSyncRepository {
    saveAlertSyncData(options: AlertSyncOptions): FutureData<void>;
}

export type AlertSyncOptions = {
    alert: Alert;
    outbreakValue: Maybe<string>;
    nationalDiseaseOutbreakEventId: Id;
    suspectedDiseases: Option[];
};
