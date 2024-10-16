import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Maybe } from "../../../utils/ts-utils";
import { ChartType } from "../../../domain/usecases/GetChartConfigByTypeUseCase";

export function useChart(chartType: ChartType, chartKey: Maybe<string>) {
    const { compositionRoot } = useAppContext();
    const [id, setId] = useState<string>();

    useEffect(() => {
        if (!chartKey) {
            return;
        }
        compositionRoot.charts.getCases.execute(chartType, chartKey).run(
            chartId => {
                setId(chartId);
            },
            error => {
                console.error(error);
            }
        );
    }, [chartKey, chartType, compositionRoot.charts.getCases]);

    return { id };
}
