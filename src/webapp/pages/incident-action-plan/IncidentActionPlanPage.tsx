import React, { useCallback } from "react";
import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { useIncidentActionPlan } from "./useIncidentActionPlan";
import { Box, Typography } from "@material-ui/core";
import { Section } from "../../components/section/Section";
import styled from "styled-components";
import { ActionPlanFormSummary } from "../../components/form/form-summary/ActionPlanFormSummary";
import { IncidentActionNotice } from "./IncidentActionNotice";
import { Loader } from "../../components/loader/Loader";
import { ResponseActionTable } from "./ResponseActionTable";
import { TeamSection } from "./TeamSection";

export const IncidentActionPlanPage: React.FC = React.memo(() => {
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();
    const id = currentEventTracker?.id || "";

    const {
        actionPlanSummary,
        formSummary: incidentActionFormSummary,
        responseActionRows,
        summaryError,
        incidentActionExists,
        responseActionColumns,
        saveTableOption,
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

    return (
        <Layout
            title={i18n.t("Incident Action Plan")}
            subtitle={i18n.t(currentEventTracker?.name || "")}
        >
            {(!actionPlanSummary && responseActionRows.length === 0 && !summaryError) || !id ? (
                <Loader />
            ) : null}
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

                    <ResponseActionTable
                        responseActionColumns={responseActionColumns}
                        responseActionRows={responseActionRows}
                        onChange={saveTableOption}
                    />

                    <ActionPlanFormSummary
                        formType="incident-action-plan"
                        formSummary={actionPlanSummary}
                        summaryError={summaryError}
                        id={id}
                    />
                </>
            )}
            {id && <TeamSection diseaseOutbreakEventId={id} />}
        </Layout>
    );
});

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
