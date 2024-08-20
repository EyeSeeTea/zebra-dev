import { FutureData } from "../../data/api-futures";
import { IncidentStatusType } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<void>;
}

export type AlertOptions = {
    eventId: Id;
    filter: { id: Id; value: string };
    incidentStatus: IncidentStatusType;
};
