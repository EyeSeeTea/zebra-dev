import React from "react";

import { useLocalForm } from "./useLocalForm";
import { FormState } from "./FormState";
import { FormLayout } from "./FormLayout";
import { FormSection } from "./FormSection";
import { Layout } from "../layout/Layout";
import { FormFieldState } from "./FormFieldsState";

export type FormProps = {
    formState: FormState;
    errorLabels?: Record<string, string>;
    onFormChange: (updatedField: FormFieldState) => void;
    onSave: () => void;
    onCancel?: () => void;
    handleAddNew?: () => void;
    handleRemove?: (id: string) => void;
};

export const Form: React.FC<FormProps> = React.memo(props => {
    const { formState, onFormChange, onSave, onCancel, errorLabels, handleAddNew, handleRemove } =
        props;
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
                        />
                    );
                })}
            </FormLayout>
        </Layout>
    );
});
