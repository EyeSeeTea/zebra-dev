import { Future } from "../../../domain/entities/generic/Future";
import { AlertOptions, AlertRepository } from "../../../domain/repositories/AlertRepository";
import { FutureData } from "../../api-futures";

export class AlertTestRepository implements AlertRepository {
    updateAlerts(_alertOptions: AlertOptions): FutureData<void> {
        return Future.success(undefined);
    }
}
