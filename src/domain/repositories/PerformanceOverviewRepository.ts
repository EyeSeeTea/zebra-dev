import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    TotalCardCounts,
    PerformanceOverviewMetrics,
    PerformanceMetrics717,
} from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { OverviewCard } from "../entities/PerformanceOverview";
import { Id } from "../entities/Ref";

export interface PerformanceOverviewRepository {
    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]>;
    getTotalCardCounts(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>,
        dateRangeFilter?: string[]
    ): FutureData<TotalCardCounts[]>;
    getDashboard717Performance(): FutureData<PerformanceMetrics717[]>;
    getEventTracker717Performance(diseaseOutbreakEventId: Id): FutureData<PerformanceMetrics717[]>;
    getEventTrackerOverviewMetrics(type: string): FutureData<OverviewCard[]>;
}
