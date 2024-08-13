import { Maybe } from "../../../utils/ts-utils";
import { validateFieldRequired, validateFieldRequiredWithNotApplicable } from "./validations";
import { UserOption } from "../user-selector/UserSelector";
import { Option } from "../utils/option";
import { ValidationError, ValidationErrorKey } from "../../../domain/entities/ValidationError";

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

export type FieldType = "text" | "boolean" | "select" | "radio" | "date" | "user";

type FormFieldStateBase<T> = {
    id: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    errors: string[];
    required?: boolean;
    showIsRequired?: boolean;
    disabled?: boolean;
    isVisible?: boolean;
    hasNotApplicable?: boolean;
    notApplicableFieldId?: string;
    width?: string;
    maxWidth?: string;
    value: T;
    type: FieldType;
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

export function getAllFieldsFromSections(formSections: FormSectionState[]): FormFieldState[] {
    return formSections.reduce(
        (acc: FormFieldState[], section: FormSectionState): FormFieldState[] => {
            if (section.subsections) {
                return [...acc, ...getAllFieldsFromSections(section.subsections)];
            } else {
                return [...acc, ...section.fields];
            }
        },
        []
    );
}

export function getStringFieldValue(id: string, allFields: FormFieldState[]): string {
    return (
        getFieldValueById<FormTextFieldState | FormOptionsFieldState | FormAvatarFieldState>(
            id,
            allFields
        ) || ""
    );
}

export function getDateFieldValue(id: string, allFields: FormFieldState[]): Date | null {
    return getFieldValueById<FormDateFieldState>(id, allFields) || null;
}

export function getBooleanFieldValue(id: string, allFields: FormFieldState[]): boolean {
    return !!getFieldValueById<FormBooleanFieldState>(id, allFields);
}

export function getMultipleOptionsFieldValue(id: string, allFields: FormFieldState[]): string[] {
    return getFieldValueById<FormMultipleOptionsFieldState>(id, allFields) || [];
}

export function getFieldValueById<F extends FormFieldState>(
    id: string,
    fields: FormFieldState[]
): F["value"] | undefined {
    const field = fields.find(field => field.id === id);
    if (field) {
        return getFieldValue<F>(field);
    }
}

export function getFieldIdFromIdsDictionary<T extends Record<string, string>>(
    key: keyof T,
    fieldIdsDictionary: T
): string {
    return fieldIdsDictionary[key] as string;
}

function getEmptyValueForField<F extends FormFieldState>(field: FormFieldState): F["value"] {
    switch (field.type) {
        case "text":
            return "";
        case "boolean":
            return false;
        case "select":
            return field.multiple ? [] : "";
        case "radio":
            return "";
        case "date":
            return null;
        case "user":
            return undefined;
    }
}

function getFieldValue<F extends FormFieldState>(field: FormFieldState): F["value"] {
    return field.value;
}

// UPDATES:

export function updateFormStateAndApplySideEffects(
    currentFormState: FormState,
    updatedField: FormFieldState
): FormState {
    const updatedFormState = updateFormState(currentFormState, updatedField);

    return applySideEffects(updatedFormState, updatedField);
}

function applySideEffects(updatedFormState: FormState, updatedField: FormFieldState): FormState {
    if (updatedField.notApplicableFieldId) {
        return {
            ...applyEffectNotApplicableFieldUpdated(updatedFormState),
        };
    } else {
        return updatedFormState;
    }
}

function applyEffectNotApplicableFieldUpdated(formState: FormState): FormState {
    return {
        ...formState,
        sections: applyEffectNotApplicableFieldUpdatedInSections(formState.sections),
    };
}

function applyEffectNotApplicableFieldUpdatedInSections(
    sectionsState: FormSectionState[]
): FormSectionState[] {
    return sectionsState.map(section => {
        if (section?.subsections) {
            return {
                ...applyEffectNotApplicableFieldUpdatedInSection(section),
                subsections: applyEffectNotApplicableFieldUpdatedInSections(section?.subsections),
            };
        } else {
            return applyEffectNotApplicableFieldUpdatedInSection(section);
        }
    });
}

function applyEffectNotApplicableFieldUpdatedInSection(
    sectionState: FormSectionState
): FormSectionState {
    return {
        ...sectionState,
        fields: sectionState.fields.map(field => {
            if (field.hasNotApplicable) {
                const notApplicableField = sectionState.fields.find(
                    f => f.notApplicableFieldId === field.id
                );

                // TODO fix this: return value type
                const fieldValue = (
                    notApplicableField?.value ? getEmptyValueForField(field) : getFieldValue(field)
                ) as any;

                return {
                    ...field,
                    value: fieldValue,
                    disabled: !!notApplicableField?.value,
                };
            }
            return field;
        }),
    };
}

export function updateFormState(prevFormState: FormState, updatedField: FormFieldState): FormState {
    return {
        ...prevFormState,
        sections: updateSectionsState(prevFormState.sections, updatedField),
    };
}

export function updateFormStateWithFieldErrors(
    formState: FormState,
    updatedField: FormFieldState,
    fieldValidationErrors: ValidationError[]
): FormState {
    return {
        ...formState,
        sections: updateSectionsState(formState.sections, updatedField, fieldValidationErrors),
    };
}

function updateSectionsState(
    prevFormSectionsState: FormSectionState[],
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormSectionState[] {
    return prevFormSectionsState.map(section => {
        if (section?.subsections) {
            return {
                ...updateSectionState(section, updatedField, fieldValidationErrors),
                subsections: updateSectionsState(
                    section?.subsections,
                    updatedField,
                    fieldValidationErrors
                ),
            };
        } else {
            return updateSectionState(section, updatedField, fieldValidationErrors);
        }
    });
}

function updateSectionState(
    prevFormSectionState: FormSectionState,
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormSectionState {
    return {
        ...prevFormSectionState,
        fields: updateFieldsState(prevFormSectionState.fields, updatedField, fieldValidationErrors),
    };
}

function updateFieldsState(
    prevFormFields: FormFieldState[],
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormFieldState[] {
    return prevFormFields.map(field => {
        if (field.id === updatedField.id) {
            return {
                ...updatedField,
                errors:
                    fieldValidationErrors?.find(error => error.property === updatedField.id)
                        ?.errors || [],
            };
        } else {
            return field;
        }
    });
}

export function updateFieldState<F extends FormFieldState>(
    fieldToUpdate: F,
    newValue: F["value"]
): F {
    return { ...fieldToUpdate, value: newValue };
}

// VALIDATIONS:

export function isValidForm(formSections: FormSectionState[]): boolean {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formSections);

    return allFields.every(field => {
        const validationErrors = validateField(field, allFields);

        return !validationErrors || validationErrors.errors.length === 0;
    });
}

export function validateForm(
    formState: FormState,
    updatedField: FormFieldState
): ValidationError[] {
    return validateSections(formState.sections, updatedField, formState);
}

function validateSections(
    sections: FormSectionState[],
    updatedField: FormFieldState,
    newState: FormState
): ValidationError[] {
    return sections.flatMap(section => {
        if (section?.subsections) {
            return [
                ...validateSection(section, updatedField, newState),
                ...validateSections(section?.subsections, updatedField, newState),
            ];
        } else {
            return validateSection(section, updatedField, newState);
        }
    });
}

function validateSection(
    section: FormSectionState,
    updatedField: FormFieldState,
    newState: FormState
): ValidationError[] {
    const allFields: FormFieldState[] = getAllFieldsFromSections(newState.sections);

    return section.fields.flatMap(field => {
        if (field.id === updatedField.id) {
            return validateField(updatedField, allFields) || [];
        }
        return [];
    });
}

function validateField(
    field: FormFieldState,
    allFields: FormFieldState[] = []
): ValidationError | undefined {
    if (field.notApplicableFieldId || !field.isVisible) return;

    const errors: ValidationErrorKey[] = [
        ...(field.required && !field.hasNotApplicable
            ? validateFieldRequired(field.value, field.type)
            : []),
        ...(field.hasNotApplicable
            ? validateFieldRequiredWithNotApplicable(
                  field.value,
                  field.type,
                  !!allFields.find(f => f.notApplicableFieldId === field.id)?.value
              )
            : []),
    ];

    return errors.length > 0
        ? {
              property: field.id,
              errors: errors,
              value: field.value,
          }
        : undefined;
}
