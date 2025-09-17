import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import {
    FiltersConfig,
    FiltersValuesType,
    TableColumn,
} from "../../components/table/statistic-table/StatisticTable";
import { AlertsPerformanceOverviewMetrics } from "../../../domain/entities/alert/AlertsPerformanceOverviewMetrics";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import i18n from "../../../utils/i18n";
import {
    AlertsPerformanceOverviewMetricsTableData,
    Order,
} from "../dashboard/useAlertsPerformanceOverview";
import { usePerformanceOverviewTable } from "../dashboard/usePerformanceOverviewTable";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { AlertDataSource } from "../../../domain/entities/alert/Alert";
import { Option } from "../../components/utils/option";
import { PerformanceMetric717 } from "../dashboard/use717Performance";
import { calculateMedian } from "../common/statisticCalculations";
import {
    DAYS_DETECTION,
    DAYS_NOTIFICATION,
    DAYS_RESPONSE,
    getColor,
} from "../common/717Performance";
import { getDateStringAsMonthYearString } from "../../components/utils/getDateStringAsMonthYearString";

type State = {
    columns: TableColumn[];
    dataAlertsPerformanceOverview: AlertsPerformanceOverviewMetricsTableData[];
    paginatedDataAlertsPerformanceOverview: AlertsPerformanceOverviewMetricsTableData[];
    columnRules: { [key: string]: number };
    order: Maybe<Order>;
    onOrderBy: (columnValue: string) => void;
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filtersConfig: FiltersConfig[];
    filters: FiltersValuesType;
    setFilters: Dispatch<SetStateAction<FiltersValuesType>>;
    filterOptions: (
        column: string,
        dataSource?: AlertDataSource
    ) => { value: string; label: string }[];
    totalPages: number;
    currentPage: number;
    goToPage: (event: React.ChangeEvent<unknown>, page: number) => void;
    eventSourceOptions: Option[];
    eventSourceSelected: string;
    setEventSourceSelected: (selection: string) => void;
    hasEventSourceFilter?: boolean;
    performanceMetrics717: PerformanceMetric717[];
};

export function useMappedAlerts(diseaseOutbreakId: Id): State {
    const {
        compositionRoot,
        configurations: { teamMembers },
        currentUser,
    } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [performanceMetrics717, setPerformanceMetrics717] = useState<PerformanceMetric717[]>([]);

    const columnRules = useMemo(
        () => ({
            detect7d: 7,
            notify1d: 1,
            respond7d: 7,
        }),
        []
    );

    const filtersConfig = useMemo<FiltersConfig[]>(() => {
        return [
            { value: "province", label: i18n.t("Province"), type: "multiselector" },
            { value: "date", label: i18n.t("Duration"), type: "datepicker" },
        ];
    }, []);

    const {
        filteredData: dataAlertsPerformanceOverview,
        setData: setAlertsDataPerformanceOverview,
        order,
        onOrderBy,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        filterOptions,
        paginatedData: paginatedDataAlertsPerformanceOverview,
        totalPages,
        currentPage,
        goToPage,
        eventSourceOptions,
        eventSourceSelected,
        setEventSourceSelected,
    } = usePerformanceOverviewTable<AlertsPerformanceOverviewMetricsTableData>({
        filtersConfig: filtersConfig,
        isPaginated: true,
    });

    const columns = useMemo<TableColumn[]>(
        () => [
            { label: i18n.t("Disease"), value: "confirmedDisease", type: "text" },
            { label: i18n.t("Province"), value: "province", type: "text" },
            { label: i18n.t("District"), value: "orgUnit", type: "text" },
            { label: i18n.t("Emergence Date"), value: "emergedDate", type: "text" },
            { label: i18n.t("Detection Date"), value: "detectionDate", type: "text" },
            { label: i18n.t("Notification Date"), value: "notifiedDate", type: "text" },
            { label: i18n.t("Response Date"), value: "respondedDate", type: "text" },
            { label: i18n.t("Manager"), value: "incidentManager", type: "text" },
            { label: i18n.t("Detect 7d"), dark: true, value: "detect7d", type: "text" },
            { label: i18n.t("Notify 1d"), dark: true, value: "notify1d", type: "text" },
            { label: i18n.t("Respond 7d"), dark: true, value: "respond7d", type: "text" },
            { label: i18n.t("Incident Status"), value: "incidentStatus", type: "text" },
            { label: i18n.t("EMS Id"), value: "eventEBSId", type: "text" },
            { label: i18n.t("Outbreak Id"), value: "eventIBSId", type: "text" },
        ],
        []
    );

    const mapEntityToTableData = useCallback(
        (
            data: AlertsPerformanceOverviewMetrics,
            allTeamMembers: TeamMember[]
        ): AlertsPerformanceOverviewMetricsTableData => {
            const incidentManager = allTeamMembers.find(tm => tm.name === data.incidentManager);

            return {
                ...data,
                emergedDate: getDateStringAsMonthYearString(data.emergedDate),
                notifiedDate: getDateStringAsMonthYearString(data.notifiedDate),
                respondedDate: getDateStringAsMonthYearString(data.respondedDate),
                detectionDate: getDateStringAsMonthYearString(data.detectionDate),
                date: getDateStringAsMonthYearString(data.date),
                incidentManager: incidentManager?.name || data.incidentManager,
                incidentManagerUsername: incidentManager?.username || "",
                province: data.province.trim(),
            };
        },
        []
    );

    const getPerformanceMetrics717 = useCallback(
        (metrics: AlertsPerformanceOverviewMetrics[]): PerformanceMetric717[] => {
            const METRIC_KEYS: Record<string, "detect7d" | "notify1d" | "respond7d"> = {
                [DAYS_DETECTION]: "detect7d",
                [DAYS_NOTIFICATION]: "notify1d",
                [DAYS_RESPONSE]: "respond7d",
            };

            return Object.entries(METRIC_KEYS).map(([metricKey, columnKey]) => {
                const values = metrics
                    .filter(
                        row =>
                            row[columnKey] !== "" &&
                            row[columnKey] !== null &&
                            row[columnKey] !== undefined
                    )
                    .map(row => Number(row[columnKey]))
                    .filter(value => !isNaN(value));

                const value = calculateMedian(values);
                return {
                    title: i18n.t(metricKey),
                    primaryValue: value,
                    secondaryValue: 0, // Not used in these metrics
                    color: getColor(metricKey, value, "event"),
                };
            });
        },
        []
    );

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.getMappedAlerts.execute(diseaseOutbreakId).run(
            performanceOverviewMetrics => {
                setPerformanceMetrics717(getPerformanceMetrics717(performanceOverviewMetrics));
                const tableData = performanceOverviewMetrics.map(data =>
                    mapEntityToTableData(data, teamMembers.all)
                );

                const dataSortedByCurrentUser = tableData.sort((a, b) => {
                    const isCurrentUserA = a.incidentManagerUsername === currentUser.username;
                    const isCurrentUserB = b.incidentManagerUsername === currentUser.username;

                    if (isCurrentUserA === isCurrentUserB) {
                        return 0;
                    }

                    return isCurrentUserA ? -1 : 1;
                });

                setAlertsDataPerformanceOverview(dataSortedByCurrentUser);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [
        compositionRoot,
        mapEntityToTableData,
        setAlertsDataPerformanceOverview,
        teamMembers.all,
        currentUser.username,
        diseaseOutbreakId,
        getPerformanceMetrics717,
    ]);

    return {
        performanceMetrics717: performanceMetrics717,
        columns,
        dataAlertsPerformanceOverview,
        paginatedDataAlertsPerformanceOverview,
        columnRules,
        order,
        onOrderBy,
        isLoading,
        searchTerm,
        setSearchTerm,
        filtersConfig,
        filters,
        setFilters,
        filterOptions,
        currentPage,
        totalPages,
        goToPage,
        eventSourceOptions,
        eventSourceSelected,
        setEventSourceSelected,
        hasEventSourceFilter: false,
    };
}
