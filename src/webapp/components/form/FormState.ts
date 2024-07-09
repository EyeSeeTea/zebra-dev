import { FormFieldState } from "./FormFieldState";
import { FormSection, FormSectionState } from "./FormSectionState";

export type FormState = {
    id: string;
    title: string;
    subtitle?: string;
    titleDescripton?: string;
    subtitleDescripton?: string;
    saveButtonLabel?: string;
    cancelButtonLabel?: string;
    sections: FormSectionState[];
    isValid: boolean;
};

export class Form {
    static updateFormState(prevFormState: FormState, updatedField: FormFieldState): FormState {
        return {
            ...prevFormState,
            sections: FormSection.updateSectionsState(prevFormState.sections, updatedField),
        };
    }
}
