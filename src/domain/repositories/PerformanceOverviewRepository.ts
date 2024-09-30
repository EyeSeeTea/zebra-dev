import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    TotalCardCounts,
    PerformanceOverviewMetrics,
} from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";

export interface PerformanceOverviewRepository {
    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]>;
    getTotalCardCounts(filters?: Record<string, string[]>): FutureData<TotalCardCounts[]>;
}
