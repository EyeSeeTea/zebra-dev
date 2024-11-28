import { DataStoreClient } from "../DataStoreClient";
import { FutureData } from "../api-futures";
import { ChartConfigRepository } from "../../domain/repositories/ChartConfigRepository";
import { Id } from "../../domain/entities/Ref";

type ChartConfig = {
    key: string;
    casesId: Id;
    deathsId: Id;
    riskAssessmentHistoryId: Id;
};

const chartConfigDatastoreKey = "charts-config";

export class ChartConfigD2Repository implements ChartConfigRepository {
    constructor(private dataStoreClient: DataStoreClient) {}

    public getCases(chartKey: string): FutureData<string> {
        return this.dataStoreClient
            .getObject<ChartConfig[]>(chartConfigDatastoreKey)
            .map(chartConfigs => {
                const currentChart = chartConfigs?.find(
                    chartConfig => chartConfig.key === chartKey
                );
                if (currentChart) return currentChart.casesId;
                else throw new Error(`Chart id not found for ${chartKey}`);
            });
    }

    public getDeaths(chartKey: string): FutureData<string> {
        return this.dataStoreClient
            .getObject<ChartConfig[]>(chartConfigDatastoreKey)
            .map(chartConfigs => {
                const currentChart = chartConfigs?.find(
                    chartConfig => chartConfig.key === chartKey
                );
                if (currentChart) return currentChart.deathsId;
                else throw new Error(`Chart id not found for ${chartKey}`);
            });
    }

    public getRiskAssessmentHistory(chartKey: string): FutureData<string> {
        return this.dataStoreClient
            .getObject<ChartConfig[]>(chartConfigDatastoreKey)
            .map(chartConfigs => {
                const currentChart = chartConfigs?.find(
                    chartConfig => chartConfig.key === chartKey
                );
                if (currentChart) return currentChart.riskAssessmentHistoryId;
                else throw new Error(`Chart id not found for ${chartKey}`);
            });
    }
}
