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
import { PerformanceIndicator717, use717Performance } from "./use717Performance";

export const DashboardPage: React.FC = React.memo(() => {
    const {
        selectorFiltersConfig,
        singleSelectFilters,
        setSingleSelectFilters,
        multiSelectFilters,
        setMultiSelectFilters,
        dateRangeFilter,
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

    const { performanceIndicators } = use717Performance();
    const { cardCounts } = useCardCounts(
        singleSelectFilters,
        multiSelectFilters,
        dateRangeFilter.value
    );

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
                <FiltersContainer>
                    {selectorFiltersConfig.map(({ id, label, placeholder, options, type }) => {
                        return (
                            <FilterContainer key={`filters-${id}`}>
                                {type === "multiselector" ? (
                                    <MultipleSelector
                                        id={`filters-${id}`}
                                        selected={multiSelectFilters[id] || []}
                                        label={i18n.t(label)}
                                        placeholder={i18n.t(placeholder)}
                                        options={options || []}
                                        onChange={(values: string[]) =>
                                            setMultiSelectFilters(id, values)
                                        }
                                    />
                                ) : (
                                    <Selector
                                        id={`filters-${id}`}
                                        options={options || []}
                                        label={i18n.t(label)}
                                        placeholder={i18n.t(placeholder)}
                                        selected={singleSelectFilters[id] || ""}
                                        onChange={(value: string) =>
                                            setSingleSelectFilters(id, value)
                                        }
                                        allowClear
                                    />
                                )}
                            </FilterContainer>
                        );
                    })}
                    <FilterContainer>
                        <DateRangePicker
                            value={dateRangeFilter.value || []}
                            onChange={dateRangeFilter.onChange}
                            placeholder={i18n.t("Select duration")}
                            label={i18n.t("Duration")}
                        />
                    </FilterContainer>
                </FiltersContainer>
                <GridWrapper>
                    {cardCounts.map((cardCount, index) => (
                        <StyledStatsCard
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
                    dateRangeFilter={dateRangeFilter.value}
                />
            </Section>
            <Section title={i18n.t("7-1-7 performance")}>
                <GridWrapper>
                    {performanceIndicators.map(
                        (
                            per: PerformanceIndicator717["performanceIndicators"][0],
                            index: number
                        ) => (
                            <StatsCard
                                key={index}
                                stat={`${per.percent}`}
                                title={per.title}
                                pretitle={`${per.count} ${i18n.t("events")}`}
                                color={per.color}
                                fillParent
                                isPercentage
                            />
                        )
                    )}
                </GridWrapper>
            </Section>
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
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
`;

const StyledStatsCard = styled(StatsCard)`
    width: 220px;
`;

const StatisticTableWrapper = styled.div`
    display: grid;
`;

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    gap: 1rem;
`;

const FilterContainer = styled.div`
    display: flex;
    width: 250px;
    max-width: 250px;
    justify-content: flex-end;
    @media (max-width: 700px) {
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 100%;
    }
`;
