import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { StatsCard } from "../../components/stats-card/StatsCard";
import { Section } from "../../components/section/Section";
import {
    FiltersConfig,
    FiltersValuesType,
    StatisticTable,
    TableColumn,
} from "../../components/table/statistic-table/StatisticTable";
import { PerformanceMetric717 } from "./use717Performance";
import { Order, PerformanceOverviewMetricsTableData } from "./useNationalPerformanceOverview";
import { Maybe } from "../../../utils/ts-utils";

export type NationalDashboardProps = {
    nationalPerformanceMetrics717: PerformanceMetric717[];

    columns: TableColumn[];
    dataNationalPerformanceOverview: PerformanceOverviewMetricsTableData[];
    editRiskAssessmentColumns: string[];
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
    allowGoToEventOnClick: true;
};

export const NationalDashboard: React.FC<NationalDashboardProps> = React.memo(props => {
    const {
        nationalPerformanceMetrics717,
        dataNationalPerformanceOverview,
        editRiskAssessmentColumns,
        ...restNationalPerformanceOverview
    } = props;

    return (
        <>
            <Section title={i18n.t("7-1-7 performance")}>
                <GridWrapper>
                    {nationalPerformanceMetrics717.map(
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
                        rows={dataNationalPerformanceOverview}
                        editRiskAssessmentColumns={editRiskAssessmentColumns}
                        {...restNationalPerformanceOverview}
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

const StatisticTableWrapper = styled.div`
    display: grid;
    row-gap: 16px;
`;
