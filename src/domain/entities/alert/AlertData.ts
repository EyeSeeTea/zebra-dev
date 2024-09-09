import { Attribute } from "@eyeseetea/d2-api/api/trackedEntityInstances";
import { Maybe } from "../../../utils/ts-utils";
import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../Ref";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";

export type AlertData = {
    alert: D2TrackerTrackedEntity;
    attribute: Maybe<Attribute>;
    dataSource: DataSource;
};

export type AlertEvent = {
    alertId: string;
    eventDate: Maybe<string>;
    orgUnit: Maybe<string>;
    suspectedCases: string;
    probableCases: string;
    confirmedCases: string;
    deaths: string;
};

export type AlertSynchronizationData = {
    lastSyncTime: string;
    type: string;
    nationalDiseaseOutbreakEventId: Id;
    alerts: AlertEvent[];
} & {
    [key in "disease" | "hazard"]?: string;
};
