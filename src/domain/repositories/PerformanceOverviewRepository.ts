import { FutureData } from "../../data/api-futures";
import { AlertsPerformanceOverviewMetrics } from "../entities/alert/AlertsPerformanceOverviewMetrics";
import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    TotalCardCounts,
    PerformanceOverviewMetrics,
    PerformanceMetrics717,
    DiseaseNames,
} from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { OverviewCard } from "../entities/PerformanceOverview";
import { Id } from "../entities/Ref";

export interface PerformanceOverviewRepository {
    getNationalPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]>;
    getAlertsPerformanceOverviewMetrics(): FutureData<AlertsPerformanceOverviewMetrics[]>;
    getMappedAlerts(diseaseOutbreakId: Id): FutureData<AlertsPerformanceOverviewMetrics[]>;
    getTotalCardCounts(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>,
        dateRangeFilter?: string[]
    ): FutureData<TotalCardCounts[]>;
    getNational717Performance(): FutureData<PerformanceMetrics717[]>;
    getEvent717Performance(diseaseOutbreakEventId: Id): FutureData<PerformanceMetrics717[]>;
    getAlerts717Performance(diseaseName?: DiseaseNames): FutureData<PerformanceMetrics717[]>;
    getEventTrackerOverviewMetrics(
        type: string,
        dataSource?: DataSource
    ): FutureData<OverviewCard[]>;
}
