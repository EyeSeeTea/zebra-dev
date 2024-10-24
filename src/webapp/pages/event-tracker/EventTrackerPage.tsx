import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { Box, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { AddCircleOutline, EditOutlined } from "@material-ui/icons";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { FormSummary } from "../../components/form/form-summary/FormSummary";
import { Chart } from "../../components/chart/Chart";
import { Section } from "../../components/section/Section";
import { BasicTable, TableColumn } from "../../components/table/BasicTable";
import { useDiseaseOutbreakEvent } from "./useDiseaseOutbreakEvent";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { MapSection } from "../../components/map/MapSection";
import LoaderContainer from "../../components/loader/LoaderContainer";
import { useMapFilters } from "./useMapFilters";
import { DateRangePicker } from "../../components/date-picker/DateRangePicker";
import { NoticeBox } from "../../components/notice-box/NoticeBox";
import { PerformanceMetric717, use717Performance } from "../dashboard/use717Performance";
import { GridWrapper, StyledStatsCard } from "../dashboard/DashboardPage";
import { StatsCard } from "../../components/stats-card/StatsCard";
import { useLastAnalyticsRuntime } from "../../hooks/useLastAnalyticsRuntime";
import { useOverviewCards } from "./useOverviewCards";

//TO DO : Create Risk assessment section
export const riskAssessmentColumns: TableColumn[] = [
    { value: "riskAssessmentDate", label: "Assessment Date", type: "text" },
    { value: "grade", label: "Grade", type: "text" },
    { value: "populationRisk", label: "Population at risk", type: "text" },
    { value: "attackRate", label: "Attack rate", type: "text" },
    { value: "geographical", label: "Geographical spread", type: "text" },
    { value: "complexity", label: "Complexity", type: "text" },
    { value: "capacity", label: "Capacity", type: "text" },
    { value: "capability", label: "Capability", type: "text" },
    { value: "reputationRisk", label: "Reputation Risk", type: "text" },
    { value: "severity", label: "Severity", type: "text" },
];

export const EventTrackerPage: React.FC = React.memo(() => {
    const { id } = useParams<{
        id: string;
    }>();
    const { goTo } = useRoutes();
    const { formSummary, summaryError, riskAssessmentRows, eventTrackerDetails } =
        useDiseaseOutbreakEvent(id);
    const { changeCurrentEventTracker: changeCurrentEventTrackerId, getCurrentEventTracker } =
        useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();
    const { lastAnalyticsRuntime } = useLastAnalyticsRuntime();

    const { overviewCards, isLoading: areOverviewCardsLoading } = useOverviewCards();

    const { dateRangeFilter } = useMapFilters();

    const goToRiskSummaryForm = useCallback(() => {
        goTo(RouteName.CREATE_FORM, {
            formType: "risk-assessment-summary",
        });
    }, [goTo]);

    const { performanceMetrics717, isLoading: _717CardsLoading } = use717Performance(
        "event_tracker",
        id
    );

    useEffect(() => {
        if (eventTrackerDetails) changeCurrentEventTrackerId(eventTrackerDetails);
    }, [changeCurrentEventTrackerId, eventTrackerDetails, id]);

    return (
        <Layout title={i18n.t("Event Tracker")} lastAnalyticsRuntime={lastAnalyticsRuntime}>
            <FormSummary
                id={id}
                formType="disease-outbreak-event"
                formSummary={formSummary}
                summaryError={summaryError}
            />
            <Section title={i18n.t("Districts Affected")} titleVariant="secondary" hasSeparator>
                <DurationFilterContainer>
                    <DateRangePicker
                        value={dateRangeFilter.value || []}
                        onChange={dateRangeFilter.onChange}
                        placeholder={i18n.t("Select duration")}
                        label={i18n.t("Duration")}
                    />
                </DurationFilterContainer>
                <LoaderContainer
                    loading={
                        !currentEventTracker?.suspectedDiseaseCode &&
                        !currentEventTracker?.hazardType &&
                        areOverviewCardsLoading
                    }
                >
                    <MapSection
                        mapKey="event_tracker"
                        eventDiseaseCode={currentEventTracker?.suspectedDiseaseCode}
                        eventHazardCode={currentEventTracker?.hazardType}
                        dateRangeFilter={dateRangeFilter.value || []}
                    />
                </LoaderContainer>
            </Section>
            <Section
                title="Risk Assessment"
                hasSeparator={true}
                headerButton={
                    riskAssessmentRows.length === 0 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditOutlined />}
                            onClick={() => {
                                goToRiskSummaryForm();
                            }}
                        >
                            {i18n.t("Create Risk Assessment")}
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<AddCircleOutline />}
                            onClick={() => {
                                goToRiskSummaryForm();
                            }}
                        >
                            {i18n.t("Add new Assessment")}
                        </Button>
                    )
                }
                titleVariant="secondary"
            >
                {riskAssessmentRows.length > 0 ? (
                    <BasicTable columns={riskAssessmentColumns} rows={riskAssessmentRows} />
                ) : (
                    <NoticeBox title={i18n.t("Risk assessment incomplete")}>
                        {i18n.t("Risks associated with this event have not yet been assessed.")}
                    </NoticeBox>
                )}
                <Box sx={{ m: 5 }} />
                {!!currentEventTracker?.riskAssessment?.grading?.length && (
                    <Chart
                        title="Risk Assessment History"
                        chartType="risk-assessment-history"
                        chartKey={
                            currentEventTracker?.suspectedDisease?.name ||
                            currentEventTracker?.hazardType
                        }
                    />
                )}
            </Section>
            <Section title="Overview" hasSeparator={true} titleVariant="secondary">
                <GridWrapper>
                    {overviewCards?.map((card, index) => (
                        <StyledStatsCard
                            key={index}
                            stat={card.value.toString()}
                            title={i18n.t(card.name)}
                            fillParent
                        />
                    ))}
                </GridWrapper>
            </Section>

            <Section hasSeparator={true}>
                <Chart
                    title="Cases"
                    chartType="cases"
                    chartKey={
                        currentEventTracker?.suspectedDisease?.name ||
                        currentEventTracker?.hazardType
                    }
                />
                <Chart
                    title="Deaths"
                    chartType="deaths"
                    chartKey={
                        currentEventTracker?.suspectedDisease?.name ||
                        currentEventTracker?.hazardType
                    }
                />
            </Section>
            <Section
                title={i18n.t("7-1-7 performance")}
                hasSeparator={true}
                titleVariant="secondary"
            >
                <GridWrapper>
                    {performanceMetrics717.map(
                        (perfMetric: PerformanceMetric717, index: number) => (
                            <StatsCard
                                key={index}
                                stat={`${perfMetric.primaryValue}`}
                                title={perfMetric.title}
                                color={perfMetric.color}
                                fillParent
                            />
                        )
                    )}
                </GridWrapper>
            </Section>
        </Layout>
    );
});

const DurationFilterContainer = styled.div`
    max-width: 250px;
`;
