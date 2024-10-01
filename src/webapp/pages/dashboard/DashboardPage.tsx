import React, { useEffect } from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { StatisticTable } from "../../components/table/statistic-table/StatisticTable";
import { usePerformanceOverview } from "./usePerformanceOverview";
import { useCardCounts } from "./useCardCounts";
import { StatsCard } from "../../components/stats-card/StatsCard";
import styled from "styled-components";
import { MultipleSelector } from "../../components/selector/MultipleSelector";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { useAlertsActiveVerifiedFilters } from "./useAlertsActiveVerifiedFilters";
import { MapSection } from "../../components/map/MapSection";
import { Selector } from "../../components/selector/Selector";
import { DateRangePicker } from "../../components/date-picker/DateRangePicker";

export const DashboardPage: React.FC = React.memo(() => {
    const {
        filtersConfig,
        singleSelectFilters,
        setSingleSelectFilters,
        multiSelectFilters,
        setMultiSelectFilters,
    } = useAlertsActiveVerifiedFilters();

    const {
        columns,
        dataPerformanceOverview,
        filters: performanceOverviewFilters,
        order,
        setOrder,
        columnRules,
        editRiskAssessmentColumns,
    } = usePerformanceOverview();

    const { cardCounts } = useCardCounts(singleSelectFilters, multiSelectFilters);

    const { goTo } = useRoutes();
    const { resetCurrentEventTracker: resetCurrentEventTrackerId } = useCurrentEventTracker();

    useEffect(() => {
        //On navigating to the dashboard page, reset the current event tracker id
        resetCurrentEventTrackerId();
    });

    const goToEvent = (id: Maybe<Id>) => {
        if (!id) return;
        goTo(RouteName.EVENT_TRACKER, { id });
    };

    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>
                <Container>
                    {filtersConfig.map(({ id, label, placeholder, options, type }) =>
                        type === "multiselector" ? (
                            <MultipleSelector
                                id={`filters-${id}`}
                                key={`filters-${id}`}
                                selected={multiSelectFilters[id] || []}
                                label={i18n.t(label)}
                                placeholder={i18n.t(placeholder)}
                                options={options || []}
                                onChange={(values: string[]) => setMultiSelectFilters(id, values)}
                            />
                        ) : (
                            <Selector
                                id={`filters-${id}`}
                                key={`filters-${id}`}
                                options={options || []}
                                label={i18n.t(label)}
                                placeholder={i18n.t(placeholder)}
                                selected={singleSelectFilters[id] || ""}
                                onChange={(value: string) => setSingleSelectFilters(id, value)}
                                allowClear
                            />
                        )
                    )}
                    <DateRangePicker
                        value={multiSelectFilters.duration || []}
                        onChange={(dates: string[]) => setMultiSelectFilters("duration", dates)}
                        placeholder={i18n.t("Select duration")}
                        label={i18n.t("Duration")}
                    />
                </Container>
                <GridWrapper>
                    {cardCounts.map((cardCount, index) => (
                        <StatsCard
                            key={index}
                            stat={cardCount.total.toString()}
                            title={i18n.t(cardCount.name)}
                            fillParent
                        />
                    ))}
                </GridWrapper>
            </Section>
            <Section title={i18n.t("All public health events")}>
                <MapSection
                    mapKey="dashboard"
                    singleSelectFilters={singleSelectFilters}
                    multiSelectFilters={multiSelectFilters}
                />
            </Section>
            <Section title={i18n.t("7-1-7 performance")}>TBD</Section>
            <Section title={i18n.t("Performance overview")}>
                <StatisticTableWrapper>
                    <StatisticTable
                        columns={columns}
                        rows={dataPerformanceOverview}
                        filters={performanceOverviewFilters}
                        order={order}
                        setOrder={setOrder}
                        columnRules={columnRules}
                        editRiskAssessmentColumns={editRiskAssessmentColumns}
                        goToEvent={goToEvent}
                    />
                </StatisticTableWrapper>
            </Section>
        </Layout>
    );
});

const GridWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
`;

const StatisticTableWrapper = styled.div`
    display: grid;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
`;
