import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { Section } from "../../section/Section";
import { Box, Button, Typography } from "@material-ui/core";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { EditOutlined } from "@material-ui/icons";
import { Loader } from "../../loader/Loader";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { Id } from "../../../../domain/entities/Ref";
import { FormType } from "../../../pages/form-page/FormPage";
import {
    IncidentActionFormSummaryData,
    IncidentActionSummary,
} from "../../../pages/incident-action-plan/useIncidentActionPlan";
import { Maybe } from "../../../../utils/ts-utils";
import { TextPreview } from "../../text-editor/TextEditor";

type ActionPlanFormSummaryProps = {
    id: Id;
    formType: FormType;
    formSummary: Maybe<IncidentActionFormSummaryData>;
    summaryError: Maybe<string>;
};

export const ActionPlanFormSummary: React.FC<ActionPlanFormSummaryProps> = React.memo(props => {
    const { id, formType, formSummary, summaryError } = props;
    const { goTo } = useRoutes();
    const snackbar = useSnackbar();

    useEffect(() => {
        if (!summaryError) return;

        snackbar.error(summaryError);
        goTo(RouteName.DASHBOARD);
    }, [summaryError, snackbar, goTo]);

    const goToActionPlan = useCallback(() => {
        goTo(RouteName.EDIT_FORM, { formType: formType, id: id });
    }, [formType, goTo, id]);

    const editButton = (
        <Button
            variant="outlined"
            color="secondary"
            onClick={goToActionPlan}
            startIcon={<EditOutlined />}
        >
            {i18n.t("Edit Action Plan")}
        </Button>
    );

    const getSummaryColumn = useCallback((incidentActionSummary: IncidentActionSummary) => {
        const { field, label, value } = incidentActionSummary;

        switch (field) {
            case "criticalInfoRequirements":
            case "expectedResults":
            case "planningAssumptions":
            case "responseObjectives":
            case "responseStrategies":
            case "responseActivitiesNarrative":
                return (
                    <Typography key={field}>
                        <Box fontWeight="bold">{i18n.t(label)}:</Box>
                        <TextPreview value={value} />
                    </Typography>
                );
            default:
                return (
                    <Typography key={field}>
                        <Box fontWeight="bold">{i18n.t(label)}:</Box>
                        {i18n.t(value)}
                    </Typography>
                );
        }
    }, []);

    return formSummary ? (
        <>
            <Section
                title={formSummary.subTitle}
                hasSeparator={true}
                headerButtons={editButton}
                titleVariant="secondary"
            >
                <SummaryContainer>
                    {formSummary.summary.map(summaryItem => getSummaryColumn(summaryItem))}
                </SummaryContainer>
            </Section>
        </>
    ) : (
        <Loader />
    );
});

const SummaryContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 0rem;
    color: ${props => props.theme.palette.text.hint};
    gap: 1rem;
    white-space: pre-line;
`;
