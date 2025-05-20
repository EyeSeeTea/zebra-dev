import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { Box, Button, useTheme } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { AddCircleOutline, EditOutlined } from "@material-ui/icons";
import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { EventTrackerFormSummary } from "../../components/form/form-summary/EventTrackerFormSummary";
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
import { SimpleModal } from "../../components/simple-modal/SimpleModal";
import { RiskAssessmentSummaryInfo } from "./RiskAssessmentSummaryInfo";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Selector } from "../../components/selector/Selector";
import { StatisticTable } from "../../components/table/statistic-table/StatisticTable";
import { Pagination } from "../../components/pagination/Pagination";
import { useMappedAlerts } from "./useMappedAlerts";

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
    const {
        formSummary,
        globalMessage,
        riskAssessmentRows,
        eventTrackerDetails,
        openCompleteModal,
        onCloseCompleteModal,
        onCompleteClick,
        onOpenCompleteModal,
        orderByRiskAssessmentDate,
    } = useDiseaseOutbreakEvent(id);
    const { changeCurrentEventTracker, getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();
    const { lastAnalyticsRuntime } = useLastAnalyticsRuntime();
    const { overviewCards, isLoading: areOverviewCardsLoading } = useOverviewCards();
    const theme = useTheme();

    const isCasesDataUserDefined =
        currentEventTracker?.casesDataSource ===
        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    const { dateRangeFilter, dataSourceFilter: mapDataSourceFilter } =
        useMapFilters(isCasesDataUserDefined);
    const { dataSourceFilter: chartsDataSourceFilter } = useMapFilters(isCasesDataUserDefined);

    const goToRiskSummaryForm = useCallback(() => {
        goTo(RouteName.CREATE_FORM, {
            formType: "risk-assessment-summary",
        });
    }, [goTo]);

    const goToRiskGradingForm = useCallback(() => {
        goTo(RouteName.CREATE_FORM, {
            formType: "risk-assessment-grading",
        });
    }, [goTo]);

    const { performanceMetrics717, isLoading: _717CardsLoading } = use717Performance("event", id);
    const {
        dataAlertsPerformanceOverview,
        paginatedDataAlertsPerformanceOverview,
        isLoading: alertsPerformanceOverviewLoading,
        totalPages,
        currentPage,
        goToPage,
        ...restAlertsPerformanceOverview
    } = useMappedAlerts(id);

    useEffect(() => {
        if (eventTrackerDetails) {
            changeCurrentEventTracker(eventTrackerDetails);
        }
    }, [changeCurrentEventTracker, eventTrackerDetails]);

    return (
        <Layout title={i18n.t("Event Tracker")} lastAnalyticsRuntime={lastAnalyticsRuntime}>
            <EventTrackerFormSummary
                id={id}
                diseaseOutbreakFormType="disease-outbreak-event"
                diseaseOutbreakCaseDataFormType="disease-outbreak-event-case-data"
                formSummary={formSummary}
                onCompleteClick={onOpenCompleteModal}
                globalMessage={globalMessage}
                isCasesDataUserDefined={isCasesDataUserDefined}
            />
            <Section title={i18n.t("Districts Affected")} titleVariant="secondary" hasSeparator>
                <FiltersSection>
                    <FilterContainer>
                        <DateRangePicker
                            value={dateRangeFilter.value || []}
                            onChange={dateRangeFilter.onChange}
                            placeholder={i18n.t("Select duration")}
                            label={i18n.t("Duration")}
                        />
                    </FilterContainer>
                    {!isCasesDataUserDefined && mapDataSourceFilter.value && (
                        <FilterContainer>
                            <Selector
                                id={"filters-data-source"}
                                options={mapDataSourceFilter.options}
                                placeholder={i18n.t("Select data source")}
                                label={i18n.t("Data Source")}
                                selected={mapDataSourceFilter.value}
                                onChange={mapDataSourceFilter.onChange}
                            />
                        </FilterContainer>
                    )}
                </FiltersSection>
                <LoaderContainer
                    loading={!currentEventTracker?.suspectedDiseaseCode && areOverviewCardsLoading}
                >
                    <MapSection
                        mapKey="event_tracker"
                        eventDiseaseCode={currentEventTracker?.suspectedDiseaseCode}
                        dateRangeFilter={dateRangeFilter.value || []}
                        dataSource={mapDataSourceFilter.dataSource}
                    />
                </LoaderContainer>
            </Section>
            <Section
                title={
                    riskAssessmentRows.length === 0
                        ? i18n.t("Risk Assessment")
                        : i18n.t("Risk Assessment Summary")
                }
                hasSeparator={true}
                headerButtons={
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
                            startIcon={<EditOutlined />}
                            onClick={() => {
                                goToRiskSummaryForm();
                            }}
                        >
                            {i18n.t("Edit Risk Assessment")}
                        </Button>
                    )
                }
                titleVariant="secondary"
            >
                {currentEventTracker?.riskAssessment?.summary ? (
                    <div>
                        <RiskAssessmentSummaryInfo
                            riskAssessmentSummary={currentEventTracker?.riskAssessment?.summary}
                        />
                    </div>
                ) : (
                    <NoticeBox title={i18n.t("Risk assessment incomplete")}>
                        {i18n.t("Risks associated with this event have not yet been assessed.")}
                    </NoticeBox>
                )}
            </Section>
            {riskAssessmentRows.length > 0 ? (
                <Section
                    title={i18n.t("Risk Assessment Grade")}
                    hasSeparator={true}
                    titleVariant="secondary"
                    headerButtons={
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<AddCircleOutline />}
                            onClick={() => {
                                goToRiskGradingForm();
                            }}
                        >
                            {i18n.t("Add new Grade")}
                        </Button>
                    }
                >
                    <BasicTable
                        columns={riskAssessmentColumns}
                        rows={riskAssessmentRows}
                        onOrderBy={orderByRiskAssessmentDate}
                    />
                    <Box sx={{ m: 5 }} />
                    {!!currentEventTracker?.riskAssessment?.grading?.length && (
                        <Section title={i18n.t("Risk Assessment History")} titleVariant="secondary">
                            <Chart
                                chartType="risk-assessment-history"
                                chartKey={currentEventTracker?.suspectedDisease?.name}
                            />
                        </Section>
                    )}
                </Section>
            ) : null}

            <Section title={i18n.t("Overview")} hasSeparator={true} titleVariant="secondary">
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

            <Section
                title={i18n.t("Cases and Deaths")}
                titleVariant="secondary"
                hasSeparator={true}
            >
                {!isCasesDataUserDefined && chartsDataSourceFilter.value && (
                    <FiltersSection>
                        <FilterContainer>
                            <Selector
                                id={"filters-data-source"}
                                options={chartsDataSourceFilter.options}
                                placeholder={i18n.t("Select data source")}
                                label={i18n.t("Data Source")}
                                selected={chartsDataSourceFilter.value}
                                onChange={chartsDataSourceFilter.onChange}
                            />
                        </FilterContainer>
                    </FiltersSection>
                )}
                <Chart
                    chartType="cases-and-deaths-by-data-source"
                    chartKey={currentEventTracker?.suspectedDisease?.name}
                    casesDataSource={currentEventTracker?.casesDataSource}
                    chartProp={chartsDataSourceFilter.value || "all"}
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
            <LoaderContainer loading={alertsPerformanceOverviewLoading}>
                <Section title={i18n.t("Alerts")} hasSeparator={true} titleVariant="secondary">
                    <StatisticTableWrapper>
                        <StatisticTable
                            rows={dataAlertsPerformanceOverview}
                            paginatedRows={paginatedDataAlertsPerformanceOverview}
                            {...restAlertsPerformanceOverview}
                        />
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onChange={goToPage}
                        />
                    </StatisticTableWrapper>
                </Section>
            </LoaderContainer>

            <SimpleModal
                open={openCompleteModal}
                onClose={onCloseCompleteModal}
                title={i18n.t("Complete event")}
                closeLabel={i18n.t("Not now")}
                footerButtons={
                    <Button
                        variant="contained"
                        onClick={() => onCompleteClick()}
                        style={{
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.common.white,
                        }}
                    >
                        {i18n.t("Complete")}
                    </Button>
                }
                alignFooterButtons="end"
                buttonDirection="row-reverse"
            >
                {i18n.t("Are you sure you want to complete this Event? This cannot be undone.")}
            </SimpleModal>
        </Layout>
    );
});

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

const FiltersSection = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    gap: 1rem;
`;

const StatisticTableWrapper = styled.div`
    display: grid;
    row-gap: 16px;
`;
