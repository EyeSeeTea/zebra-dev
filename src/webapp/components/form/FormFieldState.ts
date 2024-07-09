import { Maybe } from "../../../utils/ts-utils";
import { MemberOption } from "../member-selector/MemberSelector";
import { Option } from "../utils/option";

interface FormFieldStateBase<T> {
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
}

export interface FormTextFieldState extends FormFieldStateBase<string> {
    type: "text";
    value: string;
    multiline?: boolean;
}

export interface FormBooleanFieldState extends FormFieldStateBase<boolean> {
    type: "boolean";
}

export interface FormOptionsFieldState extends FormFieldStateBase<string | string[]> {
    type: "select" | "radio";
    options: Option[];
    multiple?: boolean;
}

export interface FormDateFieldState extends FormFieldStateBase<Date | null> {
    type: "date";
}

export interface FormAvatarFieldState extends FormFieldStateBase<Maybe<string>> {
    type: "member";
    options: MemberOption[];
}

export type FormFieldState =
    | FormTextFieldState
    | FormOptionsFieldState
    | FormBooleanFieldState
    | FormDateFieldState
    | FormAvatarFieldState;

export class FormField {
    static updateFieldsState(
        prevFormFields: FormFieldState[],
        updatedField: FormFieldState
    ): FormFieldState[] {
        const updatedFields = prevFormFields.map(field => {
            return field.id === updatedField.id ? updatedField : field;
        });

        return updatedFields;
    }

    static updateState<F extends FormFieldState>(fieldToUpdate: F, newValue: F["value"]): F {
        return { ...fieldToUpdate, value: newValue };
    }
}
