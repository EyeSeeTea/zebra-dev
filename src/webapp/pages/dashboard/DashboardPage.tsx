import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";

export const DashboardPage: React.FC = React.memo(() => {
    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section>
            <Section title={i18n.t("All public health events")}>
                All public health events content
            </Section>
            <Section title={i18n.t("7-1-7 performance")}>7-1-7 performance content</Section>
            <Section title={i18n.t("Performance overview")}>Performance overview content</Section>
        </Layout>
    );
});
