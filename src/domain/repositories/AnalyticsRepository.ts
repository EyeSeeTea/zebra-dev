import { FutureData } from "../../data/api-futures";
import {
    Indicator717PerformanceBaseAttrs,
    DiseaseTotalAttrs,
    ProgramIndicatorBaseAttrs,
} from "../../data/repositories/AnalyticsD2Repository";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface AnalyticsRepository {
    getProgramIndicators(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<ProgramIndicatorBaseAttrs[]>;
    getDiseasesTotal(filters?: Record<string, string[]>): FutureData<DiseaseTotalAttrs[]>;
    get717Performance(
        filters?: Record<string, string[]>
    ): FutureData<Indicator717PerformanceBaseAttrs[]>;
}
