import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]>;
}

export type OutbreakValueCode = string;

export type AlertOptions = {
    eventId: Id;
    outbreakValue: Maybe<OutbreakValueCode>;
};
