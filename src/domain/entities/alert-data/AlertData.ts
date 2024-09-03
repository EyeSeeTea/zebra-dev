import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";

export type OutbreakType = "disease" | "hazard";

export type Alert = {
    alertId: string;
    eventDate: Maybe<string>;
    orgUnit: Maybe<string>;
    "Suspected Cases": string;
    "Probable Cases": string;
    "Confirmed Cases": string;
    Deaths: string;
};

export type AlertSynchronizationData = {
    lastSyncTime: string;
    type: string;
    nationalTrackedEntityEventId: Id;
    alerts: Alert[];
} & {
    [key in OutbreakType]?: string;
};
