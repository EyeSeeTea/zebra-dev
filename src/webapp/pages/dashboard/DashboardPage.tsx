import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { useNationalPerformanceOverview } from "./useNationalPerformanceOverview";
import { useCardCounts } from "./useCardCounts";
import { StatsCard } from "../../components/stats-card/StatsCard";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { useAlertsActiveVerifiedFilters } from "./useAlertsActiveVerifiedFilters";
import { use717Performance } from "./use717Performance";
import { Loader } from "../../components/loader/Loader";
import { useLastAnalyticsRuntime } from "../../hooks/useLastAnalyticsRuntime";
import { useAlertsPerformanceOverview } from "./useAlertsPerformanceOverview";
import { AlertsDashboard } from "./AlertsDashboard";
import { NationalDashboard } from "./NationalDashboard";
import { useLocation } from "react-router-dom";
import { routes } from "../../hooks/useRoutes";

export const DashboardPage: React.FC = React.memo(() => {
    const location = useLocation();

    const isAlertsDashboard = useMemo(
        () => location.pathname === routes.ALERTS_DASHBOARD,
        [location]
    );

    const isZebraDashboard = useMemo(
        () => location.pathname === routes.ZEBRA_DASHBOARD,
        [location]
    );

    const {
        selectorFiltersConfig,
        singleSelectFilters,
        setSingleSelectFilters,
        multiSelectFilters,
        setMultiSelectFilters,
        dateRangeFilter,
    } = useAlertsActiveVerifiedFilters();

    const {
        dataNationalPerformanceOverview,
        editRiskAssessmentColumns,
        isLoading: performanceOverviewLoading,
        ...restNationalPerformanceOverview
    } = useNationalPerformanceOverview();

    const {
        dataAlertsPerformanceOverview,
        paginatedDataAlertsPerformanceOverview,
        isLoading: alertsPerformanceOverviewLoading,
        totalPages,
        currentPage,
        goToPage,
        ...restAlertsPerformanceOverview
    } = useAlertsPerformanceOverview();

    const {
        performanceMetrics717: nationalPerformanceMetrics717,
        isLoading: national717CardsLoading,
    } = use717Performance({ type: "national" });

    const { performanceMetrics717: alertsPerformanceMetrics717, isLoading: alerts717CardsLoading } =
        use717Performance({
            type: "alerts",
            singleSelectFilters: singleSelectFilters,
        });

    const { cardCounts, isLoading: cardCountsLoading } = useCardCounts(
        singleSelectFilters,
        multiSelectFilters,
        dateRangeFilter.value
    );

    const { resetCurrentEventTracker: resetCurrentEventTrackerId } = useCurrentEventTracker();
    const { lastAnalyticsRuntime } = useLastAnalyticsRuntime();

    useEffect(() => {
        //On navigating to the dashboard page, reset the current event tracker id
        resetCurrentEventTrackerId();
    }, [resetCurrentEventTrackerId]);

    return performanceOverviewLoading ||
        alertsPerformanceOverviewLoading ||
        national717CardsLoading ||
        alerts717CardsLoading ? (
        <Loader />
    ) : (
        <Layout
            title={
                isAlertsDashboard
                    ? i18n.t("eIDSR Alerts Dashboard")
                    : i18n.t("Zebra Events Dashboard")
            }
            showCreateEvent
            lastAnalyticsRuntime={lastAnalyticsRuntime}
        >
            {isAlertsDashboard ? (
                <AlertsDashboard
                    selectorFiltersConfig={selectorFiltersConfig}
                    singleSelectFilters={singleSelectFilters}
                    setSingleSelectFilters={setSingleSelectFilters}
                    multiSelectFilters={multiSelectFilters}
                    setMultiSelectFilters={setMultiSelectFilters}
                    dateRangeFilter={dateRangeFilter}
                    cardCountsLoading={cardCountsLoading}
                    cardCounts={cardCounts}
                    alertsPerformanceMetrics717={alertsPerformanceMetrics717}
                    dataAlertsPerformanceOverview={dataAlertsPerformanceOverview}
                    paginatedDataAlertsPerformanceOverview={paginatedDataAlertsPerformanceOverview}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    goToPage={goToPage}
                    {...restAlertsPerformanceOverview}
                />
            ) : null}

            {isZebraDashboard ? (
                <NationalDashboard
                    nationalPerformanceMetrics717={nationalPerformanceMetrics717}
                    dataNationalPerformanceOverview={dataNationalPerformanceOverview}
                    editRiskAssessmentColumns={editRiskAssessmentColumns}
                    {...restNationalPerformanceOverview}
                />
            ) : null}
        </Layout>
    );
});

export const GridWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
`;

export const StyledStatsCard = styled(StatsCard)`
    width: 220px;
`;
