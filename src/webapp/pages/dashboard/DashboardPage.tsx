import React from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";

export const DashboardPage: React.FC = React.memo(() => {
    return <Layout title={i18n.t("Dashboard")}>DashboardPage</Layout>;
});
