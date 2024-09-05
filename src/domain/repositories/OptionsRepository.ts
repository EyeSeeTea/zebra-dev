import { FutureData } from "../../data/api-futures";
import { Code, Option } from "../entities/Ref";

export interface OptionsRepository {
    get(optionCode: Code, optionSetCode: Code): FutureData<Option>;
    //event tracker options
    getMainSyndrome(optionCode: Code): FutureData<Option>;
    getSuspectedDisease(optionCode: Code): FutureData<Option>;
    getNotificationSource(optionCode: Code): FutureData<Option>;
    getDataSources(): FutureData<Option[]>;
    getHazardTypes(): FutureData<Option[]>;
    getMainSyndromes(): FutureData<Option[]>;
    getSuspectedDiseases(): FutureData<Option[]>;
    getNotificationSources(): FutureData<Option[]>;
    getIncidentStatus(): FutureData<Option[]>;
    //risk assessment grading options
    getPopulationAtRisks(): FutureData<Option[]>;
    getLowMediumHighOptions(): FutureData<Option[]>;
    getGeographicalSpreads(): FutureData<Option[]>;
    getCapacities(): FutureData<Option[]>;
    getCapabilities(): FutureData<Option[]>;
}
