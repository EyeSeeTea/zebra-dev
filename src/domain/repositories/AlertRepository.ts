import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { IncidentStatusType } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<void>;
}

export type AlertOptions = {
    eventId: Id;
    filter: { id: Id; value: Maybe<string> };
    incidentStatus: IncidentStatusType;
};
