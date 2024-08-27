import { FutureData } from "../../data/api-futures";
import { EventTracker } from "../entities/event-tracker/EventTracker";
import { Id } from "../entities/Ref";

export interface EventTrackerRepository {
    get(id: Id): FutureData<EventTracker>;
    getAll(): FutureData<EventTracker[]>;
    save(diseaseOutbreak: EventTracker): FutureData<void>;
}
