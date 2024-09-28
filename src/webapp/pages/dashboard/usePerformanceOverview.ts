import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { FiltersConfig, TableColumn } from "../../components/table/statistic-table/StatisticTable";
import { Maybe } from "../../../utils/ts-utils";
import { PerformanceOverviewMetrics } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

type State = {
    columns: TableColumn[];
    dataPerformanceOverview: PerformanceOverviewMetrics[];
    columnRules: { [key: string]: number };
    editRiskAssessmentColumns: string[];
    filters: FiltersConfig[];
    order: Maybe<Order>;
    setOrder: Dispatch<SetStateAction<Maybe<Order>>>;
    isLoading: boolean;
};

export type Order = { name: keyof PerformanceOverviewMetrics; direction: "asc" | "desc" };

export function usePerformanceOverview(): State {
    const { compositionRoot } = useAppContext();

    const [dataPerformanceOverview, setDataPerformanceOverview] = useState<
        PerformanceOverviewMetrics[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        if (dataPerformanceOverview) {
            setDataPerformanceOverview(
                (prevDataPerformanceOverview: PerformanceOverviewMetrics[]) => {
                    const newDataPerformanceOverview = _(prevDataPerformanceOverview)
                        .orderBy([
                            [
                                (dataPerformanceOverviewData: PerformanceOverviewMetrics) => {
                                    const value =
                                        dataPerformanceOverviewData[order?.name || "creationDate"];
                                    return Number.isNaN(Number(value)) ? value : Number(value);
                                },
                                order?.direction || "asc",
                            ],
                        ])
                        .value();

                    return newDataPerformanceOverview;
                }
            );
        }
    }, [order, dataPerformanceOverview]);

    const mapEntityToTableData = useCallback(
        (programIndicator: PerformanceOverviewMetrics): PerformanceOverviewMetrics => {
            return {
                ...programIndicator,
                event: programIndicator.event,
            };
        },
        []
    );
    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.getPerformanceOverviewMetrics.execute().run(
            programIndicators => {
                const mappedData = programIndicators.map((data: PerformanceOverviewMetrics) =>
                    mapEntityToTableData(data)
                );
                setDataPerformanceOverview(mappedData);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.performanceOverview.getPerformanceOverviewMetrics, mapEntityToTableData]);

    const columns: TableColumn[] = [
        { label: "Event", value: "event" },
        { label: "Province", value: "province" },
        { label: "Cases", value: "cases" },
        { label: "Deaths", value: "deaths" },
        { label: "Duration", value: "duration" },
        { label: "Manager", value: "manager" },
        { label: "Detect 7d", dark: true, value: "detect7d" },
        { label: "Notify 1d", dark: true, value: "notify1d" },
        { label: "ERA1", value: "era1" },
        { label: "ERA2", value: "era2" },
        { label: "ERA3", value: "era3" },
        { label: "ERA4", value: "era4" },
        { label: "ERA5", value: "era5" },
        { label: "ERA6", value: "era6" },
        { label: "ERA7", value: "era7" },
        { label: "Respond 7d", dark: true, value: "respond7d" },
    ];
    const editRiskAssessmentColumns = ["era1", "era2", "era3", "era4", "era5", "era6", "era7"];
    const columnRules: { [key: string]: number } = {
        detect7d: 7,
        notify1d: 1,
        respond7d: 7,
    };

    const filters: FiltersConfig[] = [
        { value: "event", label: "Event", type: "multiselector" },
        { value: "province", label: "Province", type: "multiselector" },
    ];

    return {
        dataPerformanceOverview,
        filters,
        order,
        setOrder,
        columnRules,
        editRiskAssessmentColumns,
        columns,
        isLoading,
    };
}
