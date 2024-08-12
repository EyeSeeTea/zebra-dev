import { FutureData } from "../../data/api-futures";
import { CodedNamedRef, Id, Option } from "../entities/Ref";

export interface OptionsRepository {
    get(id: Id): FutureData<Option>;
    getAllHazardTypes(): FutureData<CodedNamedRef[]>;
    getAllMainSyndromes(): FutureData<CodedNamedRef[]>;
    getAllSuspectedDiseases(): FutureData<CodedNamedRef[]>;
    getAllNotificationSources(): FutureData<CodedNamedRef[]>;
    getAllIncidentStatus(): FutureData<CodedNamedRef[]>;
}
