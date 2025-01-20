import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import { DateRangePicker } from "../../components/date-picker/DateRangePicker";
import LoaderContainer from "../../components/loader/LoaderContainer";
import { MapSection } from "../../components/map/MapSection";
import { Section } from "../../components/section/Section";
import { MultipleSelector } from "../../components/selector/MultipleSelector";
import { Selector } from "../../components/selector/Selector";
import { StatsCard } from "../../components/stats-card/StatsCard";
import {
    FiltersConfig,
    FiltersValuesType,
    StatisticTable,
    TableColumn,
} from "../../components/table/statistic-table/StatisticTable";
import { PerformanceMetric717 } from "./use717Performance";
import i18n from "../../../utils/i18n";
import { Pagination } from "../../components/pagination/Pagination";
import { SelectorFiltersConfig } from "./useAlertsActiveVerifiedFilters";
import { TotalCardCounts } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { AlertsPerformanceOverviewMetricsTableData, Order } from "./useAlertsPerformanceOverview";
import { Maybe } from "../../../utils/ts-utils";

export type AlertsDashboardProps = {
    selectorFiltersConfig: SelectorFiltersConfig[];
    singleSelectFilters: Record<string, string>;
    setSingleSelectFilters: (id: string, value: string) => void;
    multiSelectFilters: Record<string, string[]>;
    setMultiSelectFilters: (id: string, values: string[]) => void;
    dateRangeFilter: {
        onChange: (value: string[]) => void;
        value: string[];
    };

    cardCountsLoading: boolean;
    cardCounts: TotalCardCounts[];

    alertsPerformanceMetrics717: PerformanceMetric717[];

    columns: TableColumn[];
    dataAlertsPerformanceOverview: AlertsPerformanceOverviewMetricsTableData[];
    paginatedDataAlertsPerformanceOverview: AlertsPerformanceOverviewMetricsTableData[];
    columnRules: { [key: string]: number };
    order: Maybe<Order>;
    onOrderBy: (columnValue: string) => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filtersConfig: FiltersConfig[];
    filters: FiltersValuesType;
    setFilters: Dispatch<SetStateAction<FiltersValuesType>>;
    filterOptions: (column: string) => { value: string; label: string }[];
    totalPages: number;
    currentPage: number;
    goToPage: (event: React.ChangeEvent<unknown>, page: number) => void;
};

export const AlertsDashboard: React.FC<AlertsDashboardProps> = React.memo(props => {
    const {
        selectorFiltersConfig,
        singleSelectFilters,
        setSingleSelectFilters,
        multiSelectFilters,
        setMultiSelectFilters,
        dateRangeFilter,
        cardCountsLoading,
        cardCounts,
        alertsPerformanceMetrics717,
        dataAlertsPerformanceOverview,
        paginatedDataAlertsPerformanceOverview,
        totalPages,
        currentPage,
        goToPage,
        ...restAlertsPerformanceOverview
    } = props;

    return (
        <>
            <Section>
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
                <LoaderContainer loading={cardCountsLoading}>
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
                </LoaderContainer>
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
                    {alertsPerformanceMetrics717.map(
                        (perfMetric717: PerformanceMetric717, index: number) => (
                            <StatsCard
                                key={index}
                                stat={`${perfMetric717.primaryValue}`}
                                title={perfMetric717.title}
                                pretitle={`${perfMetric717.secondaryValue} ${i18n.t("events")}`}
                                color={perfMetric717.color}
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
        </>
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
    row-gap: 16px;
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
