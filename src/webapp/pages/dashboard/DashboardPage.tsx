import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { StatisticTable } from "../../components/table/statistic-table/StatisticTable";
import { usePerformanceOverview } from "./usePerformanceOverview";
import { useDiseasesTotal } from "./useDiseasesTotal";
import { StatsCard } from "../../components/stats-card/StatsCard";
import styled from "styled-components";
import { MultipleSelector } from "../../components/selector/MultipleSelector";

export const DashboardPage: React.FC = React.memo(() => {
    const {
        columns,
        dataPerformanceOverview,
        filters,
        order,
        setOrder,
        columnRules,
        editRiskAssessmentColumns,
    } = usePerformanceOverview();

    const {
        diseasesTotal,
        filterOptions,
        filters: incidentStatusFilters,
        setFilters: setIncidentStatusFilters,
    } = useDiseasesTotal();

    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>
                <Container>
                    {filterOptions.map(({ value, label, options }) => (
                        <MultipleSelector
                            id={`filters-${value}`}
                            key={`filters-${value}`}
                            selected={incidentStatusFilters[value] || []}
                            placeholder={i18n.t(label)}
                            options={options || []}
                            onChange={(values: string[]) => {
                                setIncidentStatusFilters({
                                    ...incidentStatusFilters,
                                    [value]: values,
                                });
                            }}
                        />
                    ))}
                </Container>
                <GridWrapper>
                    {diseasesTotal &&
                        diseasesTotal.map((disease, index) => (
                            <StatsCard key={index} stat={disease.total} title={disease.name} />
                        ))}
                </GridWrapper>
            </Section>
            <Section title={i18n.t("Performance overview")}>
                <StatisticTable
                    columns={columns}
                    rows={dataPerformanceOverview}
                    filters={filters}
                    order={order}
                    setOrder={setOrder}
                    columnRules={columnRules}
                    editRiskAssessmentColumns={editRiskAssessmentColumns}
                />
            </Section>
        </Layout>
    );
});

const GridWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    width: 20rem;
    gap: 1rem;
`;
