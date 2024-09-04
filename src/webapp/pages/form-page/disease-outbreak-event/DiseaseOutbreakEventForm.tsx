import React, { useEffect } from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";

import { useDiseaseOutbreakEventForm } from "./useDiseaseOutbreakEventForm";
import { Form } from "../../../components/form/Form";
import { Id } from "../../../../domain/entities/Ref";
import { Layout } from "../../../components/layout/Layout";
import { Loader } from "../../../components/loader/Loader";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";

type DiseaseOutbreakEventFormProps = {
    diseaseOutbreakEventId?: Id;
};

// TODO: Thinking for the future about making this more generic
export const DiseaseOutbreakEventForm: React.FC<DiseaseOutbreakEventFormProps> = React.memo(
    props => {
        const { diseaseOutbreakEventId } = props;

        const { goTo } = useRoutes();
        const snackbar = useSnackbar();
        const {
            formLabels,
            globalMessage,
            formState,
            isSaved,
            isLoading,
            handleFormChange,
            onSaveForm,
            onCancelForm,
        } = useDiseaseOutbreakEventForm(diseaseOutbreakEventId);

        useEffect(() => {
            if (!globalMessage) return;

            snackbar[globalMessage.type](globalMessage.text);
        }, [globalMessage, snackbar]);

        useEffect(() => {
            if (isSaved) {
                goTo(RouteName.DASHBOARD);
            }
        }, [goTo, isSaved]);

        return formState.kind === "loading" || isLoading ? (
            <Layout hideSideBarOptions>
                <Loader />
            </Layout>
        ) : formState.kind === "loaded" ? (
            <Form
                formState={formState.data}
                onFormChange={handleFormChange}
                onSave={onSaveForm}
                onCancel={onCancelForm}
                errorLabels={formLabels?.errors}
            />
        ) : (
            formState.message && <ErrorMessageContainer>{formState.message}</ErrorMessageContainer>
        );
    }
);

const ErrorMessageContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
