import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Maybe } from "../../../utils/ts-utils";
import { ChartConfig, ChartType } from "../../../domain/usecases/GetChartConfigByTypeUseCase";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type useChartProps = {
    chartType: ChartType;
    chartKey: Maybe<string>;
    casesDataSource?: CasesDataSource;
    chartProp?: string;
};

export function useChart(prop: useChartProps) {
    const { chartType, chartKey, casesDataSource, chartProp } = prop;
    const { compositionRoot } = useAppContext();
    const [charts, setCharts] = useState<ChartConfig>();

    const id = (chartProp && charts?.[chartProp]) || (chartKey && charts?.[chartKey]);

    useEffect(() => {
        if (!chartKey) {
            return;
        }
        compositionRoot.charts.getCases.execute(chartType, chartKey, casesDataSource).run(
            charts => setCharts(charts),
            error => console.error(error)
        );
    }, [casesDataSource, chartKey, chartType, compositionRoot.charts.getCases]);

    return { id };
}
