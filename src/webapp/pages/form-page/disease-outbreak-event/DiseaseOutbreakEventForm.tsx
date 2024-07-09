import React, { useEffect } from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";

import { useDiseaseOutbreakEventForm } from "./useDiseaseOutbreakEventForm";
import { Form } from "../../../components/form/Form";
import { Id } from "../../../../domain/entities/Ref";
import { FormType } from "../FormPage";
import { Layout } from "../../../components/layout/Layout";
import { Loader } from "../../../components/loader/Loader";

type DiseaseOutbreakEventFormProps = {
    formType: FormType;
    diseaseOutbreakEventId?: Id;
};

export const DiseaseOutbreakEventForm: React.FC<DiseaseOutbreakEventFormProps> = React.memo(
    props => {
        const { diseaseOutbreakEventId, formType } = props;

        const snackbar = useSnackbar();
        const { globalMessage, formState, handleFormChange, onSaveForm, onCancelForm } =
            useDiseaseOutbreakEventForm(formType, diseaseOutbreakEventId);

        useEffect(() => {
            if (!globalMessage) return;

            if (globalMessage?.type === "error") {
                snackbar.error(globalMessage.text);
            }

            if (globalMessage?.type === "warning") {
                snackbar.warning(globalMessage.text);
            }

            if (globalMessage?.type === "success") {
                snackbar.success(globalMessage?.text);
            }
        }, [globalMessage, snackbar]);

        return formState.kind === "loading" ? (
            <Layout hideSideBarOptions>
                <Loader />
            </Layout>
        ) : formState.kind === "loaded" ? (
            <Form
                formState={formState.data}
                onFormChange={handleFormChange}
                onSave={onSaveForm}
                onCancel={onCancelForm}
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
