import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import {
    DataSource,
    NationalIncidentStatus,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { IncidentStatus } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]>;
    updateAlertIncidentStatus(
        alertId: Id,
        orgUnitName: string,
        status: IncidentStatus
    ): FutureData<void>;
    getIncidentStatusByAlert(alertId: Id): FutureData<Maybe<IncidentStatus>>;
}

export type OutbreakValueCode = string;

export type AlertOptions = {
    dataSource: DataSource;
    eventId: Id;
    outbreakValue: Maybe<OutbreakValueCode>;
    incidentStatus: NationalIncidentStatus;
};
