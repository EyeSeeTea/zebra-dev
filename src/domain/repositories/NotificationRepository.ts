import { PostMessage } from "@eyeseetea/d2-api/api/messageConversations";
import { FutureData } from "../../data/api-futures";

export interface NotificationRepository {
    save(notification: Notification): FutureData<void>;
}

export type Notification = PostMessage;
