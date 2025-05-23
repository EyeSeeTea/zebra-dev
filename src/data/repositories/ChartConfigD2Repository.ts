import { DataStoreClient } from "../DataStoreClient";
import { FutureData } from "../api-futures";
import { ChartConfigRepository } from "../../domain/repositories/ChartConfigRepository";
import { Id } from "../../domain/entities/Ref";
import {
    CasesDataSource,
    DataSource,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Maybe } from "../../utils/ts-utils";
import { Future } from "../../domain/entities/generic/Future";

type ChartConfig = {
    key: string;
    casesId: Id;
    deathsId: Id;
    riskAssessmentHistoryId: Id;
    casesDataSource: CasesDataSource;
    casesAndDeathsByDataSource: { [K in DataSource]: Id } | { all: Id } | null;
};

const chartConfigDatastoreKey = "charts-config";

export class ChartConfigD2Repository implements ChartConfigRepository {
    constructor(private dataStoreClient: DataStoreClient) {}

    public getRiskAssessmentHistory(chartKey: string): FutureData<string> {
        return this.getChartsConfig(chartKey).flatMap(currentChart => {
            if (currentChart) return Future.success(currentChart.riskAssessmentHistoryId);
            else return Future.error(new Error(`Chart id not found for ${chartKey}`));
        });
    }

    public getCasesAndDeathsByDataSource(
        chartKey: string,
        casesDataSource: CasesDataSource
    ): FutureData<Record<string, string>> {
        return this.getChartsConfig(chartKey, casesDataSource).flatMap(currentChart => {
            if (currentChart)
                return Future.success(
                    currentChart.casesAndDeathsByDataSource as Record<string, string>
                );
            else return Future.error(new Error(`Chart id not found for ${chartKey}`));
        });
    }

    private getChartsConfig(
        chartKey: string,
        casesDataSource?: CasesDataSource
    ): FutureData<Maybe<ChartConfig>> {
        return this.dataStoreClient
            .getObject<ChartConfig[]>(chartConfigDatastoreKey)
            .map(chartConfigs => {
                return chartConfigs?.find(
                    chartConfig =>
                        chartConfig.key === chartKey &&
                        (!casesDataSource || chartConfig.casesDataSource === casesDataSource)
                );
            });
    }
}
