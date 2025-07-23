import { FutureData } from "../../data/api-futures";
import { NotificationSource } from "../entities/disease-outbreak-event/NotificationSources";

export interface NotificationSourcesRepository {
    getAll(): FutureData<NotificationSource[]>;
}
