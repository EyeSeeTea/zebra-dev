import { FormField, FormFieldState } from "./FormFieldState";

export type FormSectionState = {
    id: string;
    title?: string;
    isVisible?: boolean;
    required?: boolean;
    direction?: "row" | "column";
    fields: FormFieldState[];
    subsections?: FormSectionState[];
};

export class FormSection {
    static updateSectionsState(
        prevFormSectionsState: FormSectionState[],
        updatedField: FormFieldState
    ): FormSectionState[] {
        const updatedSections = prevFormSectionsState.map(section => {
            if (section?.subsections) {
                return {
                    ...section,
                    subsections: this.updateSectionsState(section?.subsections, updatedField),
                };
            }
            return this.updateState(section, updatedField);
        });

        return updatedSections;
    }

    static updateState(
        prevFormSectionState: FormSectionState,
        updatedField: FormFieldState
    ): FormSectionState {
        return {
            ...prevFormSectionState,
            fields: FormField.updateFieldsState(prevFormSectionState.fields, updatedField),
        };
    }
}
