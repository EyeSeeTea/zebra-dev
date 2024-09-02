import { D2Api } from "@eyeseetea/d2-api/2.36";
import {
    Notification,
    NotificationRepository,
} from "../../domain/repositories/NotificationRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";

export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    save(notification: Notification): FutureData<void> {
        return apiToFuture(this.api.messageConversations.post(notification)).flatMap(_res =>
            Future.success(undefined)
        );
    }
}
