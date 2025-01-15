import React from "react";
import { Section } from "../section/Section";
import { Visualisation } from "../visualisation/Visualisation";
import { useAppContext } from "../../contexts/app-context";
import { useChart } from "./useChart";
import { Maybe } from "../../../utils/ts-utils";
import LoaderContainer from "../loader/LoaderContainer";
import { ChartType } from "../../../domain/usecases/GetChartConfigByTypeUseCase";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type ChartProps = {
    title: string;
    chartType: ChartType;
    chartKey: Maybe<string>;
    casesDataSource?: CasesDataSource;
    hasSeparator?: boolean;
    lastUpdated?: string;
};
export const Chart: React.FC<ChartProps> = React.memo(props => {
    const { api } = useAppContext();
    const { title, hasSeparator, lastUpdated, chartType, chartKey, casesDataSource } = props;

    const { id } = useChart(chartType, chartKey, casesDataSource);

    const chartUrl = `${api.baseUrl}/dhis-web-data-visualizer/#/${id}`;

    return (
        <LoaderContainer loading={!id}>
            <Section
                title={title}
                hasSeparator={hasSeparator}
                titleVariant="secondary"
                lastUpdated={lastUpdated}
            >
                <Visualisation type="chart" srcUrl={chartUrl} />
            </Section>
        </LoaderContainer>
    );
});
