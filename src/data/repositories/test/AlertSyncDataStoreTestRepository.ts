import { Future } from "../../../domain/entities/generic/Future";
import {
    AlertSyncOptions,
    AlertSyncRepository,
} from "../../../domain/repositories/AlertSyncRepository";
import { FutureData } from "../../api-futures";

export class AlertSyncDataStoreTestRepository implements AlertSyncRepository {
    saveAlertSyncData(_options: AlertSyncOptions): FutureData<void> {
        return Future.success(undefined);
    }
}
