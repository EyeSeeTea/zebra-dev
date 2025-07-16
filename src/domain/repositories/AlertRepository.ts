import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Code, Id } from "../entities/Ref";

export interface AlertRepository {
    updateActiveVerifiedRespondAlerts(alertOptions: AlertOptions): FutureData<Alert[]>;
    updateAlertPHEOCStatusAndMappedEventId(options: UpdatePHEOCStatusOptions): FutureData<void>;
    getById(alertId: Id): FutureData<Alert>;
    getAllActive(): FutureData<Alert[]>;
    updateAlertsPHEOCStatusByDiseaseOutbreakId(
        diseaseOutbreakId: Id,
        pheocStatus: IncidentStatus
    ): FutureData<void>;
    complete(id: Id): FutureData<void>;
    updateConfirmedDiseaseAndChangeMappedEventId(
        alertId: Id,
        newDiseaseCode: Code,
        maybeDiseaseOutbreakId: Maybe<Id>
    ): FutureData<void>;
    getAlertsById(ids: Id[]): FutureData<Alert[]>;
    getAlertsByDiseaseOutbreakId(diseaseOutbreakId: Id): FutureData<Alert[]>;
    updateAllSuspectedDiseaseWithConfirmed(): FutureData<void>;
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
