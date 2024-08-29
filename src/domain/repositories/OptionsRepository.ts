import { FutureData } from "../../data/api-futures";
import { Id, Option } from "../entities/Ref";

export interface OptionsRepository {
    get(id: Id): FutureData<Option>;
    getDataSources(): FutureData<Option[]>;
    getHazardTypes(): FutureData<Option[]>;
    getMainSyndromes(): FutureData<Option[]>;
    getSuspectedDiseases(): FutureData<Option[]>;
    getNotificationSources(): FutureData<Option[]>;
    getIncidentStatus(): FutureData<Option[]>;
}
