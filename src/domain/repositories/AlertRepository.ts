import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateEventIdInAlerts(alertOptions: AlertOptions): FutureData<void>;
}

export type AlertOptions = {
    eventId: Id;
    filter: { id: Id; value: string };
};
