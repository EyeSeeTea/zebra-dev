import { FutureData } from "../../data/api-futures";
import { Code, Option } from "../entities/Ref";

export interface OptionsRepository {
    get(optionCode: Code, optionSetCode: Code): FutureData<Option>;
    getMainSyndrome(optionCode: Code): FutureData<Option>;
    getSuspectedDisease(optionCode: Code): FutureData<Option>;
    getNotificationSource(optionCode: Code): FutureData<Option>;
    getDataSources(): FutureData<Option[]>;
    getHazardTypes(): FutureData<Option[]>;
    getHazardTypesByCode(): FutureData<Option[]>;
    getMainSyndromes(): FutureData<Option[]>;
    getSuspectedDiseases(): FutureData<Option[]>;
    getNotificationSources(): FutureData<Option[]>;
    getIncidentStatus(): FutureData<Option[]>;
}
