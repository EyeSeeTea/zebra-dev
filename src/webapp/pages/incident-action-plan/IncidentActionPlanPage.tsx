import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";

export const IncidentActionPlanPage: React.FC = React.memo(() => {
    return (
        <Layout
            title={i18n.t("Incident Action Plan")}
            subtitle={i18n.t("Cholera in NW Province, June 2023")}
        ></Layout>
    );
});
