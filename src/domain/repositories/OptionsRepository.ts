import { FutureData } from "../../data/api-futures";
import { Code, Option } from "../entities/Ref";

export interface OptionsRepository {
    //event tracker options
    getMainSyndrome(optionCode: Code): FutureData<Option>;
    getSuspectedDisease(optionCode: Code): FutureData<Option>;
    getNotificationSource(optionCode: Code): FutureData<Option>;
    getAllDataSources(): FutureData<Option[]>;
    getAllHazardTypes(): FutureData<Option[]>;
    getAllMainSyndromes(): FutureData<Option[]>;
    getAllSuspectedDiseases(): FutureData<Option[]>;
    getAllNotificationSources(): FutureData<Option[]>;
    getAllIncidentStatus(): FutureData<Option[]>;
    //risk assessment grading options
    getPopulationAtRisks(): FutureData<Option[]>;
    getLowMediumHighOptions(): FutureData<Option[]>;
    getGeographicalSpreads(): FutureData<Option[]>;
    getCapacities(): FutureData<Option[]>;
    getCapabilities(): FutureData<Option[]>;
}
