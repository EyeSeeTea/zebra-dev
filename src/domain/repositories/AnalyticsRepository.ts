import { FutureData } from "../../data/api-futures";
import { ProgramIndicatorBaseAttrs } from "../../data/repositories/AnalyticsD2Repository";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface AnalyticsRepository {
    getProgramIndicators(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<ProgramIndicatorBaseAttrs[]>;
    getDiseasesTotal(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>
    ): FutureData<any>;
}
