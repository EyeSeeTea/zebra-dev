import { FutureData } from "../../data/api-futures";
import { Code, Option } from "../entities/Ref";

export interface OptionsRepository {
    getMainSyndrome(optionCode: Code): FutureData<Option>;
    getSuspectedDisease(optionCode: Code): FutureData<Option>;
    getNotificationSource(optionCode: Code): FutureData<Option>;
    getAllDataSources(): FutureData<Option[]>;
    getAllHazardTypes(): FutureData<Option[]>;
    getAllMainSyndromes(): FutureData<Option[]>;
    getAllSuspectedDiseases(): FutureData<Option[]>;
    getAllNotificationSources(): FutureData<Option[]>;
    getAllIncidentStatus(): FutureData<Option[]>;
}
