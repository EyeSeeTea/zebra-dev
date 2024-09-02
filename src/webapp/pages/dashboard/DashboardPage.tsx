import React, { useEffect } from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { StatisticTable } from "../../components/table/statistic-table/StatisticTable";
import { usePerformanceOverview } from "./usePerformanceOverview";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useCurrentEventTrackerId } from "../../contexts/current-event-tracker-context";

export const DashboardPage: React.FC = React.memo(() => {
    const {
        columns,
        dataPerformanceOverview,
        filters,
        columnRules,
        editRiskAssessmentColumns,
        isLoading,
    } = usePerformanceOverview();

    const { goTo } = useRoutes();
    const { resetCurrentEventTrackerId } = useCurrentEventTrackerId();

    useEffect(() => {
        //On navigating to the dashboard page, reset the current event tracker id
        resetCurrentEventTrackerId();
    });

    const goToEvent = (id: Maybe<Id>) => {
        if (!id) return;
        goTo(RouteName.EVENT_TRACKER, { id: id }); //TO DO : Change to dynamic formType when available
    };
    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            {/* <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section> */}
            <Section title={i18n.t("Performance overview")}>
                {isLoading ? <div>Loading...</div> : null}
                <StatisticTable
                    columns={columns}
                    rows={dataPerformanceOverview}
                    filters={filters}
                    columnRules={columnRules}
                    editRiskAssessmentColumns={editRiskAssessmentColumns}
                    goToEvent={goToEvent}
                />
            </Section>
        </Layout>
    );
});
