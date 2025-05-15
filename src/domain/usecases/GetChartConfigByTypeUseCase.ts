import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { ChartConfigRepository } from "../repositories/ChartConfigRepository";

export type ChartType = "cases-and-deaths-by-data-source" | "risk-assessment-history";

export type ChartConfig = Record<string, string>;

export class GetChartConfigByTypeUseCase {
    constructor(private chartConfigRepository: ChartConfigRepository) {}

    public execute(
        chartType: ChartType,
        chartKey: string,
        casesDataSource?: CasesDataSource
    ): FutureData<ChartConfig> {
        if (chartType === "risk-assessment-history") {
            return this.chartConfigRepository
                .getRiskAssessmentHistory(chartKey)
                .map(chartId => ({ [chartKey]: chartId }));
        } else if (chartType === "cases-and-deaths-by-data-source" && casesDataSource) {
            return this.chartConfigRepository.getCasesAndDeathsByDataSource(
                chartKey,
                casesDataSource
            );
        } else {
            return Future.error(
                new Error(`Invalid chart type: ${chartType} or cases data source is missing`)
            );
        }
    }
}
