import React from "react";
import { Visualisation } from "../visualisation/Visualisation";
import { useAppContext } from "../../contexts/app-context";
import { useChart } from "./useChart";
import { Maybe } from "../../../utils/ts-utils";
import LoaderContainer from "../loader/LoaderContainer";
import { ChartType } from "../../../domain/usecases/GetChartConfigByTypeUseCase";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type ChartProps = {
    chartType: ChartType;
    chartKey: Maybe<string>;
    casesDataSource?: CasesDataSource;
    chartProp?: string;
};
export const Chart: React.FC<ChartProps> = React.memo(props => {
    const { api } = useAppContext();
    const { chartType, chartKey, chartProp, casesDataSource } = props;

    const { id } = useChart({ chartType, chartKey, casesDataSource, chartProp });

    const chartUrl = `${api.baseUrl}/dhis-web-data-visualizer/#/${id}`;

    return (
        <LoaderContainer loading={!id}>
            <Visualisation
                type="chart"
                srcUrl={chartUrl}
                key={`${chartType}-${chartKey}-${chartProp}`}
            />
        </LoaderContainer>
    );
});
