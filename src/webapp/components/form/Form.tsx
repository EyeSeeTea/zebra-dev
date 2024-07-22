import React from "react";

import { useForm } from "./useForm";
import { FormState } from "./FormState";
import { FormLayout } from "./FormLayout";
import { FormSection } from "./FormSection";
import { FormFieldState } from "./FormFieldState";
import { Layout } from "../layout/Layout";

export type FormProps = {
    formState: FormState;
    onFormChange: (newFormState: FormState, updatedField: FormFieldState) => void;
    onSave: () => void;
    onCancel?: () => void;
};

export const Form: React.FC<FormProps> = React.memo(props => {
    const { formState, onFormChange, onSave, onCancel } = props;

    const { formLocalState, handleUpdateFormField } = useForm(formState, onFormChange);

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
                        />
                    );
                })}
            </FormLayout>
        </Layout>
    );
});
