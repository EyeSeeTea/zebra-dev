import { ValidationError } from "../../../domain/entities/ValidationError";
import { FormFieldState, getAllFieldsFromSections, validateField } from "./FormFieldsState";
import {
    applyEffectNotApplicableFieldUpdatedInSections,
    FormSectionState,
    updateSections,
    validateSections,
} from "./FormSectionsState";

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

export function updateFormState(formState: FormState, updatedField: FormFieldState): FormState {
    return {
        ...formState,
        sections: updateSections(formState.sections, updatedField),
    };
}

export function updateFormStateWithFieldErrors(
    formState: FormState,
    updatedField: FormFieldState,
    fieldValidationErrors: ValidationError[]
): FormState {
    return {
        ...formState,
        sections: updateSections(formState.sections, updatedField, fieldValidationErrors),
    };
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
