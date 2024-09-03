import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Future } from "../../../domain/entities/generic/Future";
import { AlertOptions, AlertRepository } from "../../../domain/repositories/AlertRepository";
import { FutureData } from "../../api-futures";

export class AlertTestRepository implements AlertRepository {
    updateAlerts(_alertOptions: AlertOptions): FutureData<D2TrackerTrackedEntity[]> {
        return Future.success([]);
    }
}
