import { FutureData } from "../../data/api-futures";
import { EventTracker } from "../entities/event-tracker/EventTracker";
import { EventTrackerRepository } from "../repositories/EventTrackerRepository";

export class GetAllEventTrackersUseCase {
    constructor(private eventTrackerRepository: EventTrackerRepository) {}

    public execute(): FutureData<EventTracker[]> {
        return this.eventTrackerRepository.getAll();
    }
}
