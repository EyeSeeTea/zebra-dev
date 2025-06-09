import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Code, Id } from "../entities/Ref";

export interface AlertRepository {
    updateActiveVerifiedRespondAlerts(alertOptions: AlertOptions): FutureData<Alert[]>;
    updateAlertPHEOCStatus(options: UpdatePHEOCStatusOptions): FutureData<void>;
    getById(alertId: Id): FutureData<Alert>;
    updateAlertsPHEOCStatusByDiseaseOutbreakId(
        diseaseOutbreakId: Id,
        pheocStatus: IncidentStatus
    ): FutureData<void>;
    updateConfirmedDisease(alertId: Id, diseaseName: string): FutureData<void>;
}

export type AlertOptions = {
    diseaseOutbreakEventId: Id;
    diseaseCode: Maybe<Code>;
};

export type UpdatePHEOCStatusOptions = {
    alertId: Id;
    pheocStatus: IncidentStatus;
    diseaseOutbreakId: Maybe<Id>;
};
