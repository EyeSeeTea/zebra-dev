import { FutureData } from "../../data/api-futures";
import {
    DiseaseTotalAttrs,
    PerformanceOverviewMetrics,
} from "../../data/repositories/PerformanceOverviewD2Repository";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface PerformanceOverviewRepository {
    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]>;
    getDiseasesTotal(filters?: Record<string, string[]>): FutureData<DiseaseTotalAttrs[]>;
}
