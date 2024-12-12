import { useSnackbar } from "@eyeseetea/d2-ui-components";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "./useForm";
import { Layout } from "../../components/layout/Layout";
import { Loader } from "../../components/loader/Loader";
import { Form } from "../../components/form/Form";
import styled from "styled-components";

export type FormType =
    | "disease-outbreak-event"
    | "risk-assessment-grading"
    | "risk-assessment-questionnaire"
    | "risk-assessment-summary"
    | "incident-action-plan"
    | "incident-response-actions"
    | "incident-response-action"
    | "incident-management-team-member-assignment";

export const FormPage: React.FC = React.memo(() => {
    const { formType, id } = useParams<{
        formType: FormType;
        id?: string;
    }>();

    const snackbar = useSnackbar();
    const {
        formLabels,
        globalMessage,
        formState,
        isLoading,
        handleFormChange,
        onPrimaryButtonClick,
        onCancelForm,
        handleAddNew,
        handleRemove,
    } = useForm(formType, id);

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
    }, [globalMessage, snackbar]);

    return formState.kind === "loading" || isLoading ? (
        <Layout hideSideBarOptions>
            <Loader />
        </Layout>
    ) : formState.kind === "loaded" ? (
        <Form
            formState={formState.data}
            onFormChange={handleFormChange}
            onSave={onPrimaryButtonClick}
            onCancel={onCancelForm}
            errorLabels={formLabels?.errors}
            handleAddNew={handleAddNew}
            handleRemove={handleRemove}
        />
    ) : (
        formState.message && <ErrorMessageContainer>{formState.message}</ErrorMessageContainer>
    );
});

const ErrorMessageContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
