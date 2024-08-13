import { FutureData } from "../../data/api-futures";
import { Id, Option } from "../entities/Ref";

export interface OptionsRepository {
    get(id: Id): FutureData<Option>;
    getAllHazardTypes(): FutureData<Option[]>;
    getAllMainSyndromes(): FutureData<Option[]>;
    getAllSuspectedDiseases(): FutureData<Option[]>;
    getAllNotificationSources(): FutureData<Option[]>;
    getAllIncidentStatus(): FutureData<Option[]>;
}
