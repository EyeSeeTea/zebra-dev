import { FutureData } from "../../data/api-futures";
import { ChartConfigRepository } from "../repositories/ChartConfigRepository";

export type ChartType = "deaths" | "cases" | "risk-assessment-history";
export class GetChartConfigByTypeUseCase {
    constructor(private chartConfigRepository: ChartConfigRepository) {}

    public execute(chartType: ChartType, chartKey: string): FutureData<string> {
        if (chartType === "deaths") {
            return this.chartConfigRepository.getDeaths(chartKey);
        } else if (chartType === "cases") {
            return this.chartConfigRepository.getCases(chartKey);
        } else if (chartType === "risk-assessment-history") {
            return this.chartConfigRepository.getRiskAssessmentHistory(chartKey);
        } else {
            throw new Error(`Invalid chart type: ${chartType}`);
        }
    }
}
