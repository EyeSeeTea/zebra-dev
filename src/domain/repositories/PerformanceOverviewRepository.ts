import { FutureData } from "../../data/api-futures";
import { Indicator717PerformanceBaseAttrs } from "../../data/repositories/PerformanceOverviewD2Repository";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    TotalCardCounts,
    PerformanceOverviewMetrics,
} from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";

export interface PerformanceOverviewRepository {
    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]>;
    getTotalCardCounts(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>
    ): FutureData<TotalCardCounts[]>;
    get717Performance(): FutureData<Indicator717PerformanceBaseAttrs[]>;
}
