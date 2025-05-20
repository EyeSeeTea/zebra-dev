import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { FiltersConfig, TableColumn } from "../../components/table/statistic-table/StatisticTable";
import { AlertsPerformanceOverviewMetrics } from "../../../domain/entities/alert/AlertsPerformanceOverviewMetrics";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import i18n from "../../../utils/i18n";
import {
    AlertsPerformanceOverviewMetricsTableData,
    State,
} from "../dashboard/useAlertsPerformanceOverview";
import { usePerformanceOverviewTable } from "../dashboard/usePerformanceOverviewTable";
import { Id } from "../../../domain/entities/Ref";

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
            { label: i18n.t("Disease"), value: "event" },
            { label: i18n.t("Province"), value: "province" },
            { label: i18n.t("Organisation unit"), value: "orgUnit" },
            { label: i18n.t("Organisation unit type"), value: "orgUnitType" },
            { label: i18n.t("Duration"), value: "duration" },
            { label: i18n.t("Manager"), value: "incidentManager" },
            { label: i18n.t("Detect 7d"), dark: true, value: "detect7d" },
            { label: i18n.t("Notify 1d"), dark: true, value: "notify1d" },
            { label: i18n.t("Respond 7d"), dark: true, value: "respond7d" },
            { label: i18n.t("Incident Status"), value: "incidentStatus" },
            { label: i18n.t("EMS Id"), value: "eventEBSId" },
            { label: i18n.t("Outbreak Id"), value: "eventIBSId" },
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
