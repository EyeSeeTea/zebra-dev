import React from "react";
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

export type FormSummaryProps = {
    id: Id;
};

export const FormSummary: React.FC<FormSummaryProps> = React.memo(props => {
    const { id } = props;
    const { formSummary } = useFormSummary(id);
    const { goTo } = useRoutes();

    const editButton = (
        <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
                goTo(RouteName.EDIT_FORM, { formType: "disease-outbreak-event", id });
            }}
            startIcon={<EditOutlined />}
        >
            {i18n.t("Edit Details")}
        </Button>
    );

    return formSummary ? (
        <>
            <Section
                title={formSummary.subTitle}
                hasSeparator={true}
                headerButtom={editButton}
                titleVariant="secondary"
            >
                <SummaryContainer>
                    <SummaryColumn>
                        {formSummary.summary.map((labelWithValue, index) =>
                            index < 3 ? (
                                <Typography key={index}>
                                    <Box fontWeight="bold" display="inline">
                                        {labelWithValue.label}:
                                    </Box>{" "}
                                    {labelWithValue.value}
                                </Typography>
                            ) : null
                        )}
                    </SummaryColumn>
                    <SummaryColumn>
                        {formSummary.summary.map((labelWithValue, index) =>
                            index < 3 ? null : (
                                <SummaryColumn key={index}>
                                    <Typography>
                                        <Box fontWeight="bold" display="inline">
                                            {labelWithValue.label}:
                                        </Box>{" "}
                                        {labelWithValue.value}
                                    </Typography>
                                </SummaryColumn>
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
    width: max-content;
    align-items: center;
    margin-top: 0rem;
`;

const SummaryColumn = styled.div`
    flex: 1;
    padding-right: 1rem;
    color: ${props => props.theme.palette.text.hint};
`;
