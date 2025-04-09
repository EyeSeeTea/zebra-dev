import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import {
    FiltersConfig,
    FiltersValuesType,
    TableColumn,
} from "../../components/table/statistic-table/StatisticTable";
import { Maybe } from "../../../utils/ts-utils";
import {
    DiseaseNames,
    HazardNames,
    PerformanceOverviewMetrics,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { NationalIncidentStatus } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useExistingEventTrackerTypes } from "../../contexts/existing-event-tracker-types-context";
import { usePerformanceOverviewTable } from "./usePerformanceOverviewTable";
import i18n from "../../../utils/i18n";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { Option } from "../../components/utils/option";
import { Id } from "../../../domain/entities/Ref";

export type PerformanceOverviewMetricsTableData = {
    id: Id;
    event: string;
    province: string;
    duration: string;
    incidentManager: string;
    cases: string;
    deaths: string;
    era1: string;
    era2: string;
    era3: string;
    era4: string;
    era5: string;
    era6: string;
    era7: string;
    detect7d: string;
    notify1d: string;
    respond7d: string;
    suspectedDisease: DiseaseNames;
    hazardType: HazardNames;
    nationalIncidentStatus: string;
    date: string;
    incidentManagerUsername: string;
};

type State = {
    columns: TableColumn[];
    dataNationalPerformanceOverview: PerformanceOverviewMetricsTableData[];
    editRiskAssessmentColumns: string[];
    columnRules: { [key: string]: number };
    order: Maybe<Order>;
    onOrderBy: (columnValue: string) => void;
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filtersConfig: FiltersConfig[];
    filters: FiltersValuesType;
    setFilters: Dispatch<SetStateAction<FiltersValuesType>>;
    filterOptions: (column: string) => { value: string; label: string }[];
    totalPages: number;
    currentPage: number;
    goToPage: (event: React.ChangeEvent<unknown>, page: number) => void;
    allowGoToEventOnClick: true;
    eventSourceOptions: Option[];
    eventSourceSelected: string;
    setEventSourceSelected: (selection: string) => void;
    hasEventSourceFilter?: boolean;
};

export type Order = { name: keyof PerformanceOverviewMetricsTableData; direction: "asc" | "desc" };

export function useNationalPerformanceOverview(): State {
    const {
        compositionRoot,
        configurations: { teamMembers },
        currentUser,
    } = useAppContext();

    const { changeExistingEventTrackerTypes } = useExistingEventTrackerTypes();

    const [isLoading, setIsLoading] = useState(false);

    const filtersConfig: FiltersConfig[] = useMemo(
        () => [
            { value: "event", label: i18n.t("Event"), type: "multiselector" },
            { value: "province", label: i18n.t("Province"), type: "multiselector" },
            { value: "date", label: i18n.t("Duration"), type: "datepicker" },
        ],
        []
    );

    const columns: TableColumn[] = useMemo(
        () => [
            { label: i18n.t("Event"), value: "event", type: "text" },
            { label: i18n.t("Province"), value: "province", type: "text" },
            { label: i18n.t("Cases"), value: "cases", type: "text" },
            { label: i18n.t("Deaths"), value: "deaths", type: "text" },
            { label: i18n.t("Duration"), value: "duration", type: "text" },
            { label: i18n.t("Manager"), value: "incidentManager", type: "text" },
            { label: i18n.t("Detect 7d"), dark: true, value: "detect7d", type: "text" },
            { label: i18n.t("Notify 1d"), dark: true, value: "notify1d", type: "text" },
            { label: i18n.t("ERA1"), value: "era1", type: "text" },
            { label: i18n.t("ERA2"), value: "era2", type: "text" },
            { label: i18n.t("ERA3"), value: "era3", type: "text" },
            { label: i18n.t("ERA4"), value: "era4", type: "text" },
            { label: i18n.t("ERA5"), value: "era5", type: "text" },
            { label: i18n.t("ERA6"), value: "era6", type: "text" },
            { label: i18n.t("ERA7"), value: "era7", type: "text" },
            { label: i18n.t("Respond 7d"), dark: true, value: "respond7d", type: "text" },
            { label: i18n.t("Incident Status"), value: "nationalIncidentStatus", type: "text" },
        ],
        []
    );

    const editRiskAssessmentColumns = useMemo(
        () => ["era1", "era2", "era3", "era4", "era5", "era6", "era7"],
        []
    );

    const columnRules = useMemo(
        () => ({
            detect7d: 7,
            notify1d: 1,
            respond7d: 7,
        }),
        []
    );

    const {
        filteredData: dataNationalPerformanceOverview,
        setData: setDataPerformanceOverview,
        order,
        onOrderBy,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        filterOptions,
        totalPages,
        currentPage,
        goToPage,
        eventSourceOptions,
        eventSourceSelected,
        setEventSourceSelected,
    } = usePerformanceOverviewTable<PerformanceOverviewMetricsTableData>(filtersConfig);

    const getNationalIncidentStatusString = useCallback((status: string): string => {
        switch (status as NationalIncidentStatus) {
            case NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_ALERT:
                return i18n.t("Alert");
            case NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_CLOSED:
                return i18n.t("Closed");
            case NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_DISCARDED:
                return i18n.t("Discarded");
            case NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND:
                return i18n.t("Respond");
            case NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH:
                return i18n.t("Watch");
        }
    }, []);

    const mapEntityToTableData = useCallback(
        (
            programIndicator: PerformanceOverviewMetrics,
            allTeamMembers: TeamMember[]
        ): PerformanceOverviewMetricsTableData => {
            const incidentManagerName = allTeamMembers.find(
                tm => tm.username === programIndicator.incidentManagerUsername
            )?.name;

            return {
                ...programIndicator,
                nationalIncidentStatus: getNationalIncidentStatusString(
                    programIndicator.nationalIncidentStatus
                ),
                event: programIndicator.event,
                incidentManager: incidentManagerName || programIndicator.incidentManagerUsername,
            };
        },
        [getNationalIncidentStatusString]
    );

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.getNationalPerformanceOverviewMetrics.execute().run(
            performanceOverviewMetrics => {
                const existingEventTrackerTypes = performanceOverviewMetrics.map(
                    metric => metric.suspectedDisease || metric.hazardType
                );
                changeExistingEventTrackerTypes(existingEventTrackerTypes);
                const mappedData = performanceOverviewMetrics.map(
                    (data: PerformanceOverviewMetrics) =>
                        mapEntityToTableData(data, teamMembers.all)
                );
                const dataSortedByCurrentUser = mappedData.sort((a, b) => {
                    const isCurrentUserA = a.incidentManagerUsername === currentUser.username;
                    const isCurrentUserB = b.incidentManagerUsername === currentUser.username;

                    if (isCurrentUserA === isCurrentUserB) {
                        return 0;
                    }

                    return isCurrentUserA ? -1 : 1;
                });
                setDataPerformanceOverview(dataSortedByCurrentUser);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [
        changeExistingEventTrackerTypes,
        compositionRoot.performanceOverview.getNationalPerformanceOverviewMetrics,
        currentUser.username,
        mapEntityToTableData,
        setDataPerformanceOverview,
        teamMembers.all,
    ]);

    return {
        editRiskAssessmentColumns,
        dataNationalPerformanceOverview,
        columns,
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
        allowGoToEventOnClick: true,
        eventSourceOptions,
        eventSourceSelected,
        setEventSourceSelected,
    };
}
