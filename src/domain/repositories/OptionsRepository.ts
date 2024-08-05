import { FutureData } from "../../data/api-futures";
import { CodedNamedRef, Id, NamedRef } from "../entities/Ref";

export interface OptionsRepository {
    get(id: Id): FutureData<NamedRef>;
    getAllHazardTypes(): FutureData<CodedNamedRef[]>;
    getAllMainSyndromes(): FutureData<CodedNamedRef[]>;
    getAllSuspectedDiseases(): FutureData<CodedNamedRef[]>;
    getAllNotificationSources(): FutureData<CodedNamedRef[]>;
    getAllIncidentStatus(): FutureData<CodedNamedRef[]>;
}
