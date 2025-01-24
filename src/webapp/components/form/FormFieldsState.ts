import { Maybe } from "../../../utils/ts-utils";
import { validateFieldRequired, validateFieldRequiredWithNotApplicable } from "./validations";
import { User } from "../user-selector/UserSelector";
import { Option } from "../utils/option";
import { ValidationError, ValidationErrorKey } from "../../../domain/entities/ValidationError";
import { FormSectionState } from "./FormSectionsState";
import { Rule } from "../../../domain/entities/Rule";
import { Id } from "../../../domain/entities/Ref";

export type FieldType =
    | "text"
    | "boolean"
    | "select"
    | "radio"
    | "date"
    | "user"
    | "addNew"
    | "file";

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
    updateAllStateWithValidationErrors?: boolean;
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
    addNewOption?: boolean;
};

export type FormOptionsFieldState = FormFieldStateBase<string> & {
    type: "select" | "radio";
    options: Option[];
    multiple: false;
    addNewOption?: boolean;
};

export type FormDateFieldState = FormFieldStateBase<Date | null> & {
    type: "date";
};

export type FormAvatarFieldState = FormFieldStateBase<Maybe<string>> & {
    type: "user";
    options: User[];
};

export type Row = Record<string, string>;
export type SheetData = {
    name: string;
    headers: string[];
    rows: Row[];
};
export type FormFileFieldState = FormFieldStateBase<Maybe<File>> & {
    type: "file";
    data: Maybe<SheetData[]>;
    fileId: Maybe<Id>;
    fileTemplate: Maybe<File>;
    fileNameLabel?: string;
};

export type AddNewFieldState = FormFieldStateBase<null> & {
    type: "addNew";
};

export type FormFieldState =
    | FormTextFieldState
    | FormOptionsFieldState
    | FormMultipleOptionsFieldState
    | FormBooleanFieldState
    | FormDateFieldState
    | FormAvatarFieldState
    | FormFileFieldState;

// HELPERS:

export function getAllFieldsFromSections(formSections: FormSectionState[]): FormFieldState[] {
    return formSections.reduce(
        (acc: FormFieldState[], section: FormSectionState): FormFieldState[] => {
            if (section.subsections?.length) {
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

export function getFileFieldValue(id: string, allFields: FormFieldState[]): Maybe<File> {
    return getFieldValueById<FormFileFieldState>(id, allFields);
}

export function getFieldFileDataById(id: string, allFields: FormFieldState[]): Maybe<SheetData[]> {
    const field = allFields.find(field => field.id === id && field.type === "file");
    return field?.type === "file" ? field.data : undefined;
}

export function getFieldFileIdById(id: string, allFields: FormFieldState[]): Maybe<Id> {
    const field = allFields.find(field => field.id === id && field.type === "file");
    return field?.type === "file" ? field.fileId : undefined;
}

export function getFieldValueById<F extends FormFieldState>(
    id: string,
    fields: FormFieldState[]
): F["value"] | undefined {
    return fields.find(field => field.id === id)?.value;
}

export function getFieldIdFromIdsDictionary<T extends Record<string, string>>(
    key: keyof T,
    fieldIdsDictionary: T
): string {
    return fieldIdsDictionary[key] as string;
}

export function getFieldWithEmptyValue(field: FormFieldState): FormFieldState {
    switch (field.type) {
        case "text":
            return { ...field, value: "" };
        case "boolean":
            return { ...field, value: false };
        case "select":
            if (field.multiple) {
                return { ...field, value: [] };
            } else {
                return { ...field, value: "" };
            }
        case "radio":
            return { ...field, value: "" };
        case "date":
            return { ...field, value: null };
        case "user":
            return { ...field, value: undefined };
        case "file":
            return { ...field, value: undefined, data: undefined, fileId: undefined };
    }
}

export function isFieldInSection(section: FormSectionState, field: FormFieldState): boolean {
    return section.fields.some(f => f.id === field.id);
}

// UPDATES:

export function updateFields(
    formFields: FormFieldState[],
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormFieldState[] {
    return formFields.map(field => {
        const validationError = fieldValidationErrors?.find(error => error.property === field.id);
        const errors = validationError?.errors || [];
        const errorsInFile = validationError?.errorsInFile
            ? Object.values(validationError.errorsInFile).filter(error => error !== undefined)
            : [];
        if (field.id === updatedField.id) {
            return {
                ...updatedField,
                errors: [...errors, ...errorsInFile],
            };
        } else {
            return updatedField.updateAllStateWithValidationErrors
                ? {
                      ...field,
                      errors: [...errors, ...errorsInFile],
                  }
                : field;
        }
    });
}

export function updateFieldState<F extends FormFieldState>(
    fieldToUpdate: F,
    newValue: F["value"],
    sheetsData?: SheetData[]
): F {
    if (fieldToUpdate.type === "file") {
        return {
            ...fieldToUpdate,
            value: newValue,
            data: sheetsData,
            fileId: undefined, // If a new file is uploaded, the fileId should be undefined
        };
    } else {
        return { ...fieldToUpdate, value: newValue };
    }
}

// VALIDATIONS:

export function validateField(
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

// RULES:

export function hideFieldsAndSetToEmpty(fields: FormFieldState[]): FormFieldState[] {
    return fields.map(field => ({
        ...getFieldWithEmptyValue(field),
        isVisible: false,
        errors: [],
    }));
}

export function applyRulesInUpdatedField(
    updatedField: FormFieldState,
    formRules: Rule[]
): FormFieldState {
    const filteredRulesByFieldId = formRules.filter(rule => rule.fieldId === updatedField.id);

    if (filteredRulesByFieldId.length === 0) {
        return updatedField;
    }

    const formStateWithRulesApplied = filteredRulesByFieldId.reduce((currentUpdatedField, rule) => {
        switch (rule.type) {
            case "disableFieldsByFieldValue":
                return rule.disableFieldIds.includes(currentUpdatedField.id)
                    ? {
                          ...currentUpdatedField,
                          disabled: currentUpdatedField.value === rule.fieldValue,
                      }
                    : currentUpdatedField;
            default:
                return currentUpdatedField;
        }
    }, updatedField);

    return formStateWithRulesApplied;
}
