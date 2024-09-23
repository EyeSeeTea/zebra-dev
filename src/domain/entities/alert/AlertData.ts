import { Maybe } from "../../../utils/ts-utils";
import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../Ref";
import { Alert } from "./Alert";

export type AlertData = {
    alert: Alert;
    dataSource: DataSource;
    outbreakData: {
        id: string;
        value: string;
    };
};

export type AlertSynchronizationData = {
    lastSyncTime: string;
    type: string;
    nationalDiseaseOutbreakEventId: Id;
    alerts: {
        alertId: string;
        eventDate: Maybe<string>;
        orgUnit: Maybe<string>;
        suspectedCases: string;
        probableCases: string;
        confirmedCases: string;
        deaths: string;
    }[];
} & {
    [key in "disease" | "hazard"]?: string;
};
