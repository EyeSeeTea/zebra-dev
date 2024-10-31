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
import { IncidentActionFormSummaryData } from "../../../pages/incident-action-plan/useIncidentActionPlan";
import { Maybe } from "../../../../utils/ts-utils";

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

    const editButton = (
        <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
                goTo(RouteName.EDIT_FORM, { formType: formType, id: id }); //TO DO : Change to dynamic formType when available
            }}
            startIcon={<EditOutlined />}
        >
            {i18n.t("Edit Action Plan")}
        </Button>
    );

    const getSummaryColumn = useCallback((index: number, label: string, value: string) => {
        return (
            <Typography key={index}>
                <Box fontWeight="bold">{i18n.t(label)}:</Box> {i18n.t(value)}
            </Typography>
        );
    }, []);

    return formSummary ? (
        <>
            <Section
                title={formSummary.subTitle}
                hasSeparator={true}
                headerButton={editButton}
                titleVariant="secondary"
            >
                <SummaryContainer>
                    {formSummary.summary.map((labelWithValue, index) =>
                        getSummaryColumn(index, labelWithValue.label, labelWithValue.value)
                    )}
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
