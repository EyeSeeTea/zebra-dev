import { FutureData } from "../../data/api-futures";
import { Code, Option } from "../entities/Ref";
import {
    Capability1,
    Capability2,
    HighCapacity,
    HighGeographicalSpread,
    HighPopulationAtRisk,
    HighWeightedOption,
    LowCapacity,
    LowGeographicalSpread,
    LowPopulationAtRisk,
    LowWeightedOption,
    MediumCapacity,
    MediumGeographicalSpread,
    MediumPopulationAtRisk,
    MediumWeightedOption,
} from "../entities/risk-assessment/RiskAssessmentGrading";

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
    getPopulationAtRisks(): FutureData<
        Array<LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk>
    >;
    getLowMediumHighOptions(): FutureData<
        Array<LowWeightedOption | MediumWeightedOption | HighWeightedOption>
    >;
    getGeographicalSpreads(): FutureData<
        Array<LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread>
    >;
    getCapacities(): FutureData<Array<LowCapacity | MediumCapacity | HighCapacity>>;
    getCapabilities(): FutureData<Array<Capability1 | Capability2>>;
}
