import { FutureData } from "../../data/api-futures";

export interface ChartConfigRepository {
    getCases(chartkey: string): FutureData<string>;
    getDeaths(chartKey: string): FutureData<string>;
    getRiskAssessmentHistory(chartKey: string): FutureData<string>;
}
