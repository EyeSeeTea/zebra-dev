import React from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";

export const CreateRiskAssessmentPage: React.FC = React.memo(() => {
    return (
        <Layout
            title={i18n.t("Create Risk Assessment")}
            subtitle={i18n.t("Cholera in NW Province, June 2023")}
            hideSideBarOptions
        >
            CreateRiskAssessmentPage
        </Layout>
    );
});
