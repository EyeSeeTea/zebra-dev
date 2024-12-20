import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { ChartConfigRepository } from "../repositories/ChartConfigRepository";

export type ChartType = "deaths" | "cases" | "risk-assessment-history";
export class GetChartConfigByTypeUseCase {
    constructor(private chartConfigRepository: ChartConfigRepository) {}

    public execute(
        chartType: ChartType,
        chartKey: string,
        casesDataSource?: CasesDataSource
    ): FutureData<string> {
        if (chartType === "deaths" && casesDataSource) {
            return this.chartConfigRepository.getDeaths(chartKey, casesDataSource);
        } else if (chartType === "cases" && casesDataSource) {
            return this.chartConfigRepository.getCases(chartKey, casesDataSource);
        } else if (chartType === "risk-assessment-history") {
            return this.chartConfigRepository.getRiskAssessmentHistory(chartKey);
        } else {
            return Future.error(
                new Error(`Invalid chart type: ${chartType} or cases data source is missing`)
            );
        }
    }
}
