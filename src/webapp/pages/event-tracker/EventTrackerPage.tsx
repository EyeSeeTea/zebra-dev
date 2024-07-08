import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";

// TODO: Add every section here

export const EventTrackerPage: React.FC = React.memo(() => {
    return <Layout title={i18n.t("Event Tracker")}></Layout>;
});
