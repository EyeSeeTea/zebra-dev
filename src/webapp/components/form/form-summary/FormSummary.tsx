import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { Id } from "../../../../domain/entities/Ref";
import { Section } from "../../section/Section";
import { Box, Button, Typography } from "@material-ui/core";
import { useFormSummary } from "./useFormSummary";
import { UserCard } from "../../user-selector/UserCard";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { EditOutlined } from "@material-ui/icons";
import { Loader } from "../../loader/Loader";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

export type FormSummaryProps = {
    id: Id;
};

const ROW_COUNT = 3;

export const FormSummary: React.FC<FormSummaryProps> = React.memo(props => {
    const { id } = props;
    const { formSummary, summaryError } = useFormSummary(id);
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
                goTo(RouteName.EDIT_FORM, { formType: "disease-outbreak-event", id }); //TO DO : Change to dynamic formType when available
            }}
            startIcon={<EditOutlined />}
        >
            {i18n.t("Edit Details")}
        </Button>
    );

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

    return formSummary ? (
        <>
            <Section
                title={formSummary.subTitle}
                hasSeparator={true}
                headerButton={editButton}
                titleVariant="secondary"
            >
                <SummaryContainer>
                    <SummaryColumn>
                        {formSummary.summary.map((labelWithValue, index) =>
                            index < ROW_COUNT
                                ? getSummaryColumn(
                                      index,
                                      labelWithValue.label,
                                      labelWithValue.value
                                  )
                                : null
                        )}
                    </SummaryColumn>
                    <SummaryColumn>
                        {formSummary.summary.map((labelWithValue, index) =>
                            index < ROW_COUNT
                                ? null
                                : getSummaryColumn(
                                      index,
                                      labelWithValue.label,
                                      labelWithValue.value
                                  )
                        )}
                    </SummaryColumn>
                    <SummaryColumn>
                        {formSummary.incidentManager && (
                            <UserCard selectedUser={formSummary.incidentManager} />
                        )}
                    </SummaryColumn>
                </SummaryContainer>
            </Section>
        </>
    ) : (
        <Loader />
    );
});

const SummaryContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: max-content;
    align-items: flex-start;
    margin-top: 0rem;
    @media (max-width: 1200px) {
        flex-direction: column;
    }
`;

const SummaryColumn = styled.div`
    padding-right: 2rem;
    color: ${props => props.theme.palette.text.hint};
    min-width: fit-content;
`;
