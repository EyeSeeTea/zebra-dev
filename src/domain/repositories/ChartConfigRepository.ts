import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface ChartConfigRepository {
    getRiskAssessmentHistory(chartKey: string): FutureData<string>;
    getCasesAndDeathsByDataSource(
        chartKey: string,
        casesDataSource: CasesDataSource
    ): FutureData<Record<string, string>>;
}
