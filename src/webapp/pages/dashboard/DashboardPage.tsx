import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";

// TODO: Add every section here, first it's just an example

export const DashboardPage: React.FC = React.memo(() => {
    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section>
        </Layout>
    );
});
