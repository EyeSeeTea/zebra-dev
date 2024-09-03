import { Alert } from "../../../domain/entities/alert/Alert";
import { Future } from "../../../domain/entities/generic/Future";
import { AlertOptions, AlertRepository } from "../../../domain/repositories/AlertRepository";
import { FutureData } from "../../api-futures";

export class AlertTestRepository implements AlertRepository {
    updateAlerts(_alertOptions: AlertOptions): FutureData<Alert[]> {
        return Future.success([]);
    }
}
