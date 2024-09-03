import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import {
    DataSource,
    IncidentStatusType,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";
import { Alert } from "../entities/alert/Alert";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]>;
}

export type AlertOptions = {
    dataSource: DataSource;
    eventId: Id;
    hazardTypeCode: Maybe<string>;
    incidentStatus: IncidentStatusType;
    suspectedDiseaseCode: Maybe<string>;
};
