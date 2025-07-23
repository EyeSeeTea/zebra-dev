import { NotificationSource } from "../../../domain/entities/disease-outbreak-event/NotificationSources";
import { Future } from "../../../domain/entities/generic/Future";
import { NotificationSourcesRepository } from "../../../domain/repositories/NotificationSourcesRepository";
import { FutureData } from "../../api-futures";

export class NotificationSourcesTestRepository implements NotificationSourcesRepository {
    getAll(): FutureData<NotificationSource[]> {
        return Future.success([]);
    }
}
