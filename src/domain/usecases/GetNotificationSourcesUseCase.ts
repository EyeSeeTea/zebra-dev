import { FutureData } from "../../data/api-futures";
import { NotificationSource } from "../entities/disease-outbreak-event/NotificationSources";
import { NotificationSourcesRepository } from "../repositories/NotificationSourcesRepository";

export class GetNotificationSourcesUseCase {
    constructor(
        private options: {
            notificationSourcesRepository: NotificationSourcesRepository;
        }
    ) {}

    public execute(): FutureData<NotificationSource[]> {
        return this.options.notificationSourcesRepository.getAll();
    }
}
