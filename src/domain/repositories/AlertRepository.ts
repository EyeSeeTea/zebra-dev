import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import {
    DataSource,
    IncidentStatusType,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";

export interface AlertRepository {
    updateAlerts(alertOptions: AlertOptions): FutureData<D2TrackerTrackedEntity[]>;
}

export type AlertOptions = {
    dataSource: DataSource;
    eventId: Id;
    hazardTypeCode: Maybe<string>;
    incidentStatus: IncidentStatusType;
    suspectedDiseaseCode: Maybe<string>;
};
