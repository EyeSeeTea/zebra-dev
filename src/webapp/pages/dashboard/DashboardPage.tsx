import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { StatisticTable } from "../../components/table/statistic-table/StatisticTable";
import { usePerformanceOverview } from "./usePerformanceOverview";

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
    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section>
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
