import React, { useEffect, useMemo } from "react";
import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { StatisticTable } from "../../components/table/statistic-table/StatisticTable";
import { usePerformanceOverview } from "./usePerformanceOverview";
import { useDiseasesTotal } from "./useDiseasesTotal";
import { StatsCard, StatsCardProps } from "../../components/stats-card/StatsCard";
import styled from "styled-components";
import { MultipleSelector } from "../../components/selector/MultipleSelector";
import { Id } from "@eyeseetea/d2-api";
import { Maybe } from "../../../utils/ts-utils";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { useAlertsActiveVerifiedFilters } from "./useAlertsActiveVerifiedFilters";
import { MapSection } from "./map/MapSection";
import { Selector } from "../../components/selector/Selector";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";

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

    const { diseasesTotal } = useDiseasesTotal(singleSelectFilters, multiSelectFilters);

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

    const performances: StatsCardProps[] = [
        {
            title: "Detection",
            stat: "57",
            pretitle: "4 events",
            color: "green",
        },
        {
            title: "Notification",
            stat: "43",
            pretitle: "3 events",
            color: "red",
        },
        {
            title: "Response",
            stat: "57",
            pretitle: "4 events",
            color: "green",
        },
        {
            title: "All targets",
            stat: "14",
            pretitle: "1 events",
            color: "grey",
        },
    ];

    const allProvinceOptionsIds = useMemo(
        () =>
            filtersConfig
                .find(filter => filter.id === "province")
                ?.options.map(option => option.value),
        [filtersConfig]
    );

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
                                onChange={(values: string[]) =>
                                    setMultiSelectFilters({
                                        ...multiSelectFilters,
                                        [id]: values,
                                    })
                                }
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
                </Container>
                <GridWrapper>
                    {diseasesTotal &&
                        diseasesTotal.map((disease, index) => (
                            <StatsCard
                                key={index}
                                stat={disease.total}
                                title={disease.disease || disease.hazard}
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
                    allProvinces={allProvinceOptionsIds}
                />
            </Section>
            <Section title={i18n.t("7-1-7 performance")}>
                <GridWrapper>
                    {performances &&
                        performances.map((per, index) => (
                            <StatsCard
                                key={index}
                                stat={per.stat}
                                title={per.title}
                                pretitle={per.pretitle}
                                color={per.color}
                                fillParent
                                isPercentage
                            />
                        ))}
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
