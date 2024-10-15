import React, { useCallback } from "react";
import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { useParams } from "react-router-dom";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { useIncidentActionPlan } from "./useIncidentActionPlan";
import { Box, Button, Typography } from "@material-ui/core";
import { AddCircleOutline, EditOutlined } from "@material-ui/icons";
import { Section } from "../../components/section/Section";
import styled from "styled-components";
import { BasicTable, TableColumn, TableRowType } from "../../components/table/BasicTable";
import { ActionPlanFormSummary } from "../../components/form/form-summary/ActionPlanFormSummary";
import { IncidentActionNotice } from "./IncidentActionNotice";
import { Loader } from "../../components/loader/Loader";

export const responseActionColumns: TableColumn[] = [
    { value: "mainTask", label: "Main task", type: "text" },
    { value: "subActivities", label: "Sub Activities", type: "text" },
    { value: "subPillar", label: "Sub Pillar", type: "text" },
    { value: "searchAssignRO", label: "Responsible officer", type: "text" },
    { value: "status", label: "Status", type: "text" },
    { value: "verification", label: "Verification", type: "text" },
    { value: "timeLine", label: "Timeline", type: "text" },
    { value: "dueDate", label: "Due date", type: "text" },
];

export const IncidentActionPlanPage: React.FC = React.memo(() => {
    const { id } = useParams<{
        id: string;
    }>();
    const { goTo } = useRoutes();
    const { getCurrentEventTracker } = useCurrentEventTracker();

    const {
        actionPlanSummary,
        formSummary: incidentActionFormSummary,
        responseActionRows,
        summaryError,
        incidentActionExists,
    } = useIncidentActionPlan(id);

    const getSummaryColumn = useCallback((index: number, label: string, value: string) => {
        return (
            <Typography key={index}>
                <Box fontWeight="bold" display="inline">
                    {i18n.t(label)}:
                </Box>{" "}
                {i18n.t(value)}
            </Typography>
        );
    }, []);

    const { icon: responseActionIcon, label: responseActionLabel } =
        getResponseActionTableLabel(responseActionRows);

    return (
        <Layout
            title={i18n.t("Incident Action Plan")}
            subtitle={i18n.t(getCurrentEventTracker()?.name || "")}
        >
            {!actionPlanSummary && responseActionRows.length === 0 && !summaryError && <Loader />}
            {!incidentActionExists ? (
                <IncidentActionNotice />
            ) : (
                <>
                    <Section>
                        <SummaryContainer>
                            <SummaryColumn>
                                {incidentActionFormSummary?.map((labelWithValue, index) =>
                                    getSummaryColumn(
                                        index,
                                        labelWithValue.label,
                                        labelWithValue.value
                                    )
                                )}
                            </SummaryColumn>
                        </SummaryContainer>
                    </Section>

                    <Section
                        title="Response Actions"
                        hasSeparator={true}
                        headerButton={
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={responseActionIcon}
                                onClick={() => {
                                    goTo(RouteName.CREATE_FORM, {
                                        formType: "incident-response-action",
                                    });
                                }}
                            >
                                {i18n.t(responseActionLabel)}
                            </Button>
                        }
                        titleVariant="secondary"
                    >
                        <BasicTable columns={responseActionColumns} rows={responseActionRows} />
                        <Box sx={{ m: 5 }} />
                    </Section>

                    <ActionPlanFormSummary
                        formType="incident-action-plan"
                        formSummary={actionPlanSummary}
                        summaryError={summaryError}
                        id={id}
                    />
                </>
            )}
        </Layout>
    );
});

function getResponseActionTableLabel(responseActionRows: TableRowType[]) {
    const label =
        responseActionRows.length === 0 ? "Add new Response Action" : "Edit Response Actions";
    const icon = responseActionRows.length === 0 ? <AddCircleOutline /> : <EditOutlined />;

    return { icon: icon, label: label };
}

const SummaryContainer = styled.div`
    display: flex;
    width: max-content;
    align-items: center;
    margin-top: 0rem;
    margin-bottom: 3rem;
`;

const SummaryColumn = styled.div`
    flex: 1;
    padding-right: 2rem;
    color: ${props => props.theme.palette.text.hint};
    min-width: fit-content;
`;
