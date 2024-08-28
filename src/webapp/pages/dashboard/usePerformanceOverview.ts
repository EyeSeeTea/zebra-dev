import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";

import { FilterType, TableColumn } from "../../components/table/statistic-table/StatisticTable";
import { ProgramIndicatorBaseAttrs } from "../../../data/repositories/AnalyticsD2Repository";

type State = {
    columns: TableColumn[];
    dataPerformanceOverview: any[];
    columnRules: { [key: string]: number };
    editRiskAssessmentColumns: string[];
    filters: FilterType[];
    order?: Order;
    setOrder: (order: Order) => void;
    isLoading: boolean;
};

type PerformanceOverviewData = {
    event: string;
    province: string;
    cases: string;
    deaths: string;
    duration: string;
    manager: string;
    detect7d: string;
    notify1d: string;
    era1: string;
    era2: string;
    era3: string;
    era4: string;
    era5: string;
    era6: string;
    era7: string;
    eri: string;
    respond7d: string;
    creationDate: Date;
};

export type Order = { name: string; direction: "asc" | "desc" };
export function usePerformanceOverview(): State {
    const { compositionRoot } = useAppContext();

    const [dataPerformanceOverview, setDataPerformanceOverview] = useState<
        PerformanceOverviewData[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        if (dataPerformanceOverview) {
            setDataPerformanceOverview(
                _(dataPerformanceOverview)
                    .orderBy([
                        [
                            (dataPerformanceOverviewdata: PerformanceOverviewData) => {
                                const value =
                                    dataPerformanceOverviewdata[
                                        (order?.name as keyof PerformanceOverviewData) ||
                                            "creationDate"
                                    ];
                                return Number.isNaN(Number(value)) ? value : Number(value);
                            },
                            order?.direction || "asc",
                        ],
                    ])
                    .value()
            );
        }
    }, [order]);

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.analytics.getProgramIndicators.execute().run(
            programIndicators => {
                // console.log({ programIndicators });
                setDataPerformanceOverview(
                    programIndicators.map((data: ProgramIndicatorBaseAttrs) =>
                        mapEntityToTableData(data)
                    )
                );
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.analytics.getProgramIndicators]);

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
        { label: "ERI", value: "eri" },
        { label: "Respond 7d", dark: true, value: "respond7d" },
    ];
    const editRiskAssessmentColumns = [
        "era1",
        "era2",
        "era3",
        "era4",
        "era5",
        "era6",
        "era7",
        "eri",
    ];
    const columnRules: { [key: string]: number } = {
        detect7d: 7,
        notify1d: 1,
        respond7d: 7,
    };
    const mapEntityToTableData = (
        programIndicator: ProgramIndicatorBaseAttrs
    ): PerformanceOverviewData => {
        return {
            ...programIndicator,
            cases: "TBD",
            deaths: "TBD",
            duration: "TBD",
            eri: "-1",
        };
    };

    const filters: FilterType[] = [
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
