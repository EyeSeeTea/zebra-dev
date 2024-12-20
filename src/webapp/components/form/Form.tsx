import React from "react";
import styled from "styled-components";

import { useLocalForm } from "./useLocalForm";
import { FormState } from "./FormState";
import { FormLayout } from "./FormLayout";
import { FormSection } from "./FormSection";
import { Layout } from "../layout/Layout";
import { FormFieldState } from "./FormFieldsState";
import { SimpleModal } from "../simple-modal/SimpleModal";
import { Button } from "../button/Button";

export type ModalData = {
    title: string;
    content: string;
    cancelLabel: string;
    confirmLabel: string;
    onConfirm: () => void;
};

export type FormProps = {
    formState: FormState;
    errorLabels?: Record<string, string>;
    openModal: boolean;
    modalData?: ModalData;
    setOpenModal: (show: boolean) => void;
    onFormChange: (updatedField: FormFieldState) => void;
    onSave: () => void;
    onCancel?: () => void;
    handleAddNew?: () => void;
    handleRemove?: (id: string) => void;
};

export const Form: React.FC<FormProps> = React.memo(props => {
    const {
        formState,
        onFormChange,
        onSave,
        onCancel,
        errorLabels,
        handleAddNew,
        handleRemove,
        openModal,
        modalData,
        setOpenModal,
    } = props;
    const { formLocalState, handleUpdateFormField } = useLocalForm(formState, onFormChange);

    return (
        <Layout title={formLocalState.title} subtitle={formLocalState.subtitle} hideSideBarOptions>
            <FormLayout
                title={formLocalState.titleDescripton}
                subtitle={formLocalState.subtitleDescripton}
                onSave={onSave}
                onCancel={onCancel}
                saveLabel={formLocalState.saveButtonLabel}
                cancelLabel={formLocalState.cancelButtonLabel}
                disableSave={!formLocalState.isValid}
            >
                {formLocalState.sections.map(section => {
                    if (!section.isVisible) return null;

                    return (
                        <FormSection
                            key={section.id}
                            id={section.id}
                            title={section.title}
                            hasSeparator
                            required={section.required}
                            direction={section.direction}
                            subsections={section.subsections}
                            fields={section.fields}
                            onUpdateField={handleUpdateFormField}
                            onClickInfo={section.onClickInfo}
                            errorLabels={errorLabels}
                            handleAddNew={handleAddNew}
                            addNewField={section.addNewField}
                            handleRemove={handleRemove}
                            removeOption={section.removeOption}
                        />
                    );
                })}
            </FormLayout>
            {modalData ? (
                <SimpleModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    title={modalData.title}
                    closeLabel={modalData.cancelLabel}
                    footerButtons={
                        <Button onClick={modalData.onConfirm}>{modalData.confirmLabel}</Button>
                    }
                >
                    {openModal && <Text>{modalData.content}</Text>}
                </SimpleModal>
            ) : null}
        </Layout>
    );
});

const Text = styled.div`
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;
