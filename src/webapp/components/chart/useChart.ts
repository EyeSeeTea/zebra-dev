import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Maybe } from "../../../utils/ts-utils";
import { ChartType } from "../../../domain/usecases/GetChartConfigByTypeUseCase";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export function useChart(
    chartType: ChartType,
    chartKey: Maybe<string>,
    casesDataSource?: CasesDataSource
) {
    const { compositionRoot } = useAppContext();
    const [id, setId] = useState<string>();

    useEffect(() => {
        if (!chartKey) {
            return;
        }
        compositionRoot.charts.getCases.execute(chartType, chartKey, casesDataSource).run(
            chartId => {
                setId(chartId);
            },
            error => {
                console.error(error);
            }
        );
    }, [casesDataSource, chartKey, chartType, compositionRoot.charts.getCases]);

    return { id };
}
