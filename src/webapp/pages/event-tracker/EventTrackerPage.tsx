import React from "react";
import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { useParams } from "react-router-dom";
import { FormSummary } from "../../components/form/form-summary/FormSummary";

// TODO: Add every section here

export const EventTrackerPage: React.FC = React.memo(() => {
    const { id } = useParams<{
        id: string;
    }>();
    return (
        <Layout title={i18n.t("Event Tracker")}>
            <FormSummary id={id} />
        </Layout>
    );
});
