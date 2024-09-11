import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import {
    DataSource,
    IncidentStatus,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]>;
}

export type AlertOptions = {
    dataSource: DataSource;
    eventId: Id;
    hazardTypeCode: Maybe<string>;
    incidentStatus: IncidentStatus;
    suspectedDiseaseCode: Maybe<string>;
};
