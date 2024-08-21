import React from "react";
import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { useParams } from "react-router-dom";
import { FormSummary } from "../../components/form/form-summary/FormSummary";
import { Visualisation } from "../../components/visualisation/Visualisation";
import { Section } from "../../components/section/Section";
import { Box, Button } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import { BasicTable, TableColumn } from "../../components/table/BasicTable";

// TODO: Add every section here
export type VisualizationTypes =
    | "ALL_EVENTS_MAP"
    | "EVENT_TRACKER_AREAS_AFFECTED_MAP"
    | "RISK_ASSESSMENT_HISTORY_LINE_CHART"
    | "EVENT_TRACKER_CASES_BAR_CHART"
    | "EVENT_TRACKER_DEATHS_BAR_CHART"
    | "EVENT_TRACKER_OVERVIEW_CARDS"
    | "EVENT_TRACKER_717_CARDS";

const riskAssessmentColumns: TableColumn[] = [
    { value: "grade", label: "Grade", type: "text" },
    { value: "populationRisk", label: "Population at risk", type: "text" },
    { value: "attackRate", label: "Attack rate", type: "text" },
    { value: "geographical", label: "Geographical spread", type: "text" },
    { value: "complexity", label: "Complexity", type: "text" },
    { value: "capacity", label: "Capacity", type: "text" },
    { value: "capability", label: "Capability", type: "text" },
    { value: "reputationRisk", label: "Reputation Risk", type: "text" },
    { value: "severity", label: "Severity", type: "text" },
];

export const EventTrackerPage: React.FC = React.memo(() => {
    const { id } = useParams<{
        id: string;
    }>();

    const lastUpdated = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`; //TO DO : Fetch sync time from datastore once implemented
    return (
        <Layout title={i18n.t("Event Tracker")}>
            <FormSummary id={id} />
            <Visualisation type="EVENT_TRACKER_AREAS_AFFECTED_MAP" title="Districts Affected" />
            <Section
                title="Risk Assessment"
                hasSeparator={true}
                headerButton={
                    <Button variant="outlined" color="secondary" startIcon={<AddCircleOutline />}>
                        {i18n.t("Add new Assessment")}
                    </Button>
                }
                titleVariant="secondary"
                lastUpdated={lastUpdated}
            >
                <BasicTable columns={riskAssessmentColumns} rows={[{ grade: "Coming soon!" }]} />
                <Box sx={{ m: 5 }} />
            </Section>
            <Visualisation
                type="RISK_ASSESSMENT_HISTORY_LINE_CHART"
                title="Risk Assessment History"
            />
            <Visualisation
                type="EVENT_TRACKER_OVERVIEW_CARDS"
                title="Overview"
                hasSeparator={true}
                lastUpdated={lastUpdated}
            />
            <Visualisation type="EVENT_TRACKER_CASES_BAR_CHART" title="Cases" hasSeparator={true} />
            <Visualisation type="EVENT_TRACKER_CASES_BAR_CHART" title="Deaths" />
            <Visualisation
                type="EVENT_TRACKER_717_CARDS"
                title="7-1-7 performance"
                hasSeparator={true}
            />
        </Layout>
    );
});
