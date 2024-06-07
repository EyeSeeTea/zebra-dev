import React from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";

export const IMTeamBuilderPage: React.FC = React.memo(() => {
    return (
        <Layout
            title={i18n.t("Incident Management Team Builder")}
            subtitle={i18n.t("Cholera in NW Province, June 2023")}
        >
            IMTeamBuilderPage
        </Layout>
    );
});
