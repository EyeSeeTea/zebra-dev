import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";

import { FilterType, TableColumn } from "../../components/table/statistic-table/StatisticTable";

type State = {
    columns: TableColumn[];
    dataPerformanceOverview: any[];
    columnRules: { [key: string]: number };
    editRiskAssessmentColumns: string[];
    filters: FilterType[];
    isLoading: boolean;
};

type PerformanceOverviewData = {
    event: string;
    location: string;
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
};
export function usePerformanceOverview(): State {
    const { compositionRoot } = useAppContext();

    const [dataPerformanceOverview, setDataPerformanceOverview] = useState<
        PerformanceOverviewData[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.diseaseOutbreakEvent.getAll.execute().run(
            diseaseOutbreakEvent => {
                setDataPerformanceOverview(diseaseOutbreakEvent.map(mapEntityToTableData));
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.diseaseOutbreakEvent.getAll]);

    const columns: TableColumn[] = [
        { label: "Event", value: "event" },
        { label: "Location", value: "location" },
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
    const mapEntityToTableData = (diseaseOutbreakEvent: any) => {
        return {
            event: diseaseOutbreakEvent.name,
            location: diseaseOutbreakEvent.location,
            cases: Math.floor(Math.random() * 100).toString(),
            deaths: Math.floor(Math.random() * 100).toString(),
            duration: "4d",
            manager: "Paul Zulu",
            detect7d: "2",
            notify1d: "1",
            era1: "1",
            era2: "",
            era3: "",
            era4: "",
            era5: "",
            era6: "",
            era7: "",
            eri: "",
            respond7d: "",
        };
    };

    const filters: FilterType[] = [
        { value: "event", label: "Event", type: "multiselector" },
        // { value: "name", label: "Name", type: "multiselector" },
        // { value: "disease", label: "Disease", type: "multiselector" },
        { value: "location", label: "Location", type: "multiselector" },
        // { value: "dateRange", label: "Date range", type: "datepicker" },
    ];

    return {
        dataPerformanceOverview,
        filters,
        columnRules,
        editRiskAssessmentColumns,
        columns,
        isLoading,
    };
}
