import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { Section } from "../../section/Section";
import { Box, Button, Typography } from "@material-ui/core";
import { UserCard } from "../../user-selector/UserCard";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { EditOutlined } from "@material-ui/icons";
import { CheckOutlined } from "@material-ui/icons";
import { Loader } from "../../loader/Loader";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { FormSummaryData } from "../../../pages/event-tracker/useDiseaseOutbreakEvent";
import { Maybe } from "../../../../utils/ts-utils";
import { FormType } from "../../../pages/form-page/FormPage";
import { Id } from "../../../../domain/entities/Ref";
import { GlobalMessage } from "../../../pages/form-page/useForm";

export type EventTrackerFormSummaryProps = {
    id: Id;
    formType: FormType;
    formSummary: Maybe<FormSummaryData>;
    globalMessage: Maybe<GlobalMessage>;
    onOpenModal: () => void;
};

const ROW_COUNT = 3;

export const EventTrackerFormSummary: React.FC<EventTrackerFormSummaryProps> = React.memo(props => {
    const { id, formType, formSummary, onOpenModal: onCompleteClick, globalMessage } = props;
    const { goTo } = useRoutes();
    const snackbar = useSnackbar();

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
        goTo(RouteName.DASHBOARD);
    }, [globalMessage, goTo, snackbar]);

    const onEditClick = useCallback(() => {
        goTo(RouteName.EDIT_FORM, { formType: formType, id: id });
    }, [formType, goTo, id]);

    const editButton = (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onEditClick}
            startIcon={<EditOutlined />}
        >
            {i18n.t("Edit Details")}
        </Button>
    );

    const completeButton = (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onCompleteClick}
            startIcon={<CheckOutlined />}
        >
            {i18n.t("Complete Event")}
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
                secondaryHeaderButton={completeButton}
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
                <StyledType>
                    <Box fontWeight="bold" display="inline">
                        {i18n.t("Notes")}:
                    </Box>{" "}
                    {formSummary.notes}
                </StyledType>
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

const StyledType = styled(Typography)`
    color: ${props => props.theme.palette.text.hint};
    white-space: pre-line;
`;
