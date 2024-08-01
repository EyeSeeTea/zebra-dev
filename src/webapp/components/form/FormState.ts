import { Maybe } from "../../../utils/ts-utils";
import { UserOption } from "../user-selector/UserSelector";
import { Option } from "../utils/option";

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

export type FormSectionState = {
    id: string;
    title?: string;
    isVisible?: boolean;
    required?: boolean;
    direction?: "row" | "column";
    fields: FormFieldState[];
    subsections?: FormSectionState[];
    onClickInfo?: (id: string) => void;
};

type FieldTypes = "text" | "boolean" | "select" | "radio" | "date" | "user";

type FormFieldStateBase<T> = {
    id: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    errors?: string[];
    required?: boolean;
    showIsRequired?: boolean;
    disabled?: boolean;
    isVisible?: boolean;
    showNotApplicable?: boolean;
    width?: string;
    value: T;
    type: FieldTypes;
};

export type FormTextFieldState = FormFieldStateBase<string> & {
    type: "text";
    multiline?: boolean;
};

export type FormBooleanFieldState = FormFieldStateBase<boolean> & {
    type: "boolean";
};

export type FormMultipleOptionsFieldState = FormFieldStateBase<string[]> & {
    type: "select";
    options: Option[];
    multiple: true;
};

export type FormOptionsFieldState = FormFieldStateBase<string> & {
    type: "select" | "radio";
    options: Option[];
    multiple: false;
};

export type FormDateFieldState = FormFieldStateBase<Date | null> & {
    type: "date";
};

export type FormAvatarFieldState = FormFieldStateBase<Maybe<string>> & {
    type: "user";
    options: UserOption[];
};

export type FormFieldState =
    | FormTextFieldState
    | FormOptionsFieldState
    | FormMultipleOptionsFieldState
    | FormBooleanFieldState
    | FormDateFieldState
    | FormAvatarFieldState;

export function updateFormState(prevFormState: FormState, updatedField: FormFieldState): FormState {
    return {
        ...prevFormState,
        sections: updateSectionsState(prevFormState.sections, updatedField),
    };
}

export function updateSectionsState(
    prevFormSectionsState: FormSectionState[],
    updatedField: FormFieldState
): FormSectionState[] {
    const updatedSections = prevFormSectionsState.map(section => {
        if (section?.subsections) {
            return {
                ...updateSectionState(section, updatedField),
                subsections: updateSectionsState(section?.subsections, updatedField),
            };
        } else {
            return updateSectionState(section, updatedField);
        }
    });

    return updatedSections;
}

export function updateSectionState(
    prevFormSectionState: FormSectionState,
    updatedField: FormFieldState
): FormSectionState {
    return {
        ...prevFormSectionState,
        fields: updateFieldsState(prevFormSectionState.fields, updatedField),
    };
}

export function updateFieldsState(
    prevFormFields: FormFieldState[],
    updatedField: FormFieldState
): FormFieldState[] {
    const updatedFields = prevFormFields.map(field => {
        return field.id === updatedField.id ? updatedField : field;
    });

    return updatedFields;
}

export function updateFieldState<F extends FormFieldState>(
    fieldToUpdate: F,
    newValue: F["value"]
): F {
    return { ...fieldToUpdate, value: newValue };
}
