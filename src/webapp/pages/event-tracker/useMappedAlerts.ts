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
};

export function useMappedAlerts(diseaseOutbreakId: Id): State {
    const {
        compositionRoot,
        configurations: { teamMembers },
        currentUser,
    } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

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
    } = usePerformanceOverviewTable<AlertsPerformanceOverviewMetricsTableData>(filtersConfig, true);

    const columns = useMemo<TableColumn[]>(
        () => [
            { label: i18n.t("Disease"), value: "event", type: "text" },
            { label: i18n.t("Province"), value: "province", type: "text" },
            { label: i18n.t("Organisation unit"), value: "orgUnit", type: "text" },
            { label: i18n.t("Organisation unit type"), value: "orgUnitType", type: "text" },
            { label: i18n.t("Duration"), value: "duration", type: "text" },
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
                event: data.suspectedDisease,
                incidentManager: incidentManager?.name || data.incidentManager,
                incidentManagerUsername: incidentManager?.username || "",
            };
        },
        []
    );

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.getMappedAlerts.execute(diseaseOutbreakId).run(
            performanceOverviewMetrics => {
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
    ]);

    return {
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
