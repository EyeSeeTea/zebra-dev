import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface ChartConfigRepository {
    getCases(chartkey: string, casesDataSource: CasesDataSource): FutureData<string>;
    getDeaths(chartKey: string, casesDataSource: CasesDataSource): FutureData<string>;
    getRiskAssessmentHistory(chartKey: string): FutureData<string>;
}
