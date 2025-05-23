import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { EditOutlined } from "@material-ui/icons";
import { CheckOutlined } from "@material-ui/icons";
import BackupIcon from "@material-ui/icons/Backup";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import { Section } from "../../section/Section";
import { Box, Button, Typography } from "@material-ui/core";
import { UserCard } from "../../user-selector/UserCard";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { Loader } from "../../loader/Loader";
import { FormSummaryData } from "../../../pages/event-tracker/useDiseaseOutbreakEvent";
import { Maybe } from "../../../../utils/ts-utils";
import { Id } from "../../../../domain/entities/Ref";
import { GlobalMessage } from "../../../pages/form-page/useForm";
import { TextPreview } from "../../text-editor/TextEditor";

export type EventTrackerFormSummaryProps = {
    id: Id;
    diseaseOutbreakFormType: "disease-outbreak-event";
    diseaseOutbreakCaseDataFormType: "disease-outbreak-event-case-data";
    formSummary: Maybe<FormSummaryData>;
    globalMessage: Maybe<GlobalMessage>;
    onCompleteClick: () => void;
    isCasesDataUserDefined?: boolean;
};

const ROW_COUNT = 3;

export const EventTrackerFormSummary: React.FC<EventTrackerFormSummaryProps> = React.memo(props => {
    const {
        id,
        diseaseOutbreakCaseDataFormType,
        diseaseOutbreakFormType,
        formSummary,
        onCompleteClick,
        globalMessage,
        isCasesDataUserDefined = false,
    } = props;
    const { goTo } = useRoutes();
    const snackbar = useSnackbar();

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
        goTo(RouteName.ZEBRA_DASHBOARD);
    }, [globalMessage, goTo, snackbar]);

    const onEditClick = useCallback(() => {
        goTo(RouteName.EDIT_FORM, { formType: diseaseOutbreakFormType, id: id });
    }, [diseaseOutbreakFormType, goTo, id]);

    const onEditCaseDataClick = useCallback(() => {
        goTo(RouteName.EDIT_FORM, { formType: diseaseOutbreakCaseDataFormType, id: id });
    }, [diseaseOutbreakCaseDataFormType, goTo, id]);

    const headerButtons = (
        <>
            <Button
                variant="outlined"
                color="secondary"
                onClick={onEditClick}
                startIcon={<EditOutlined />}
            >
                {i18n.t("Edit Details")}
            </Button>

            {isCasesDataUserDefined ? (
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onEditCaseDataClick}
                    startIcon={<BackupIcon />}
                >
                    {i18n.t("Replace case data")}
                </Button>
            ) : null}

            <Button
                variant="outlined"
                color="secondary"
                onClick={onCompleteClick}
                startIcon={<CheckOutlined />}
            >
                {i18n.t("Complete Event")}
            </Button>
        </>
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
                headerButtons={headerButtons}
                titleVariant="secondary"
            >
                <IncidentManagerContainer>
                    {formSummary.incidentManager && (
                        <UserCard selectedUser={formSummary.incidentManager} />
                    )}
                </IncidentManagerContainer>
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
                </SummaryContainer>
                <StyledType>
                    <Box fontWeight="bold" display="inline">
                        {i18n.t("Notes")}:
                    </Box>{" "}
                    <TextPreview value={formSummary.notes} />
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
    width: 100%;
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
    margin-block-start: 10px;
    color: ${props => props.theme.palette.text.hint};
    white-space: pre-line;
`;

const IncidentManagerContainer = styled.div`
    margin-block-end: 10px;
`;
