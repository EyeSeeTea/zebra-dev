import { FutureData } from "../../data/api-futures";
import { OutbreakAlert } from "../entities/alert/OutbreakAlert";

export interface OutbreakAlertRepository {
    getOutbreakAlertsWithoutNationalId(): FutureData<OutbreakAlert[]>;
    updateConfirmedDiseaseInAlerts(): FutureData<void>;
}
