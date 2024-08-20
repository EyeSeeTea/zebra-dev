import { ValidationError } from "../../../domain/entities/ValidationError";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getEmptyValueForField,
    getFieldValue,
    isFieldInSection,
    updateFields,
    validateField,
} from "./FormFieldsState";
import { FormState } from "./FormState";

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

// HELPERS:

function hasSectionAFieldWithNotApplicable(sectionsState: FormSectionState) {
    return sectionsState.fields.some(field => field.hasNotApplicable);
}

// UPDATES:

export function applyEffectNotApplicableFieldUpdatedInSections(
    sectionsState: FormSectionState[]
): FormSectionState[] {
    return sectionsState.map(section => {
        if (section?.subsections) {
            const maybeAppliedEffect = hasSectionAFieldWithNotApplicable(section)
                ? applyEffectNotApplicableFieldUpdatedInSection(section)
                : section;
            return {
                ...maybeAppliedEffect,
                subsections: applyEffectNotApplicableFieldUpdatedInSections(section?.subsections),
            };
        } else {
            return hasSectionAFieldWithNotApplicable(section)
                ? applyEffectNotApplicableFieldUpdatedInSection(section)
                : section;
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

                // TODO: FIXME TypeScript error returning the corresponding fieldValue type
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

export function updateSections(
    formSectionsState: FormSectionState[],
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormSectionState[] {
    return formSectionsState.map(section => {
        if (section?.subsections) {
            const maybeUpdatedSection = isFieldInSection(section, updatedField)
                ? updateSectionState(section, updatedField, fieldValidationErrors)
                : section;
            return {
                ...maybeUpdatedSection,
                subsections: updateSections(
                    section?.subsections,
                    updatedField,
                    fieldValidationErrors
                ),
            };
        } else {
            return isFieldInSection(section, updatedField)
                ? updateSectionState(section, updatedField, fieldValidationErrors)
                : section;
        }
    });
}

function updateSectionState(
    formSectionState: FormSectionState,
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormSectionState {
    if (isFieldInSection(formSectionState, updatedField)) {
        return {
            ...formSectionState,
            fields: updateFields(formSectionState.fields, updatedField, fieldValidationErrors),
        };
    } else {
        return formSectionState;
    }
}

// VALIDATIONS:

export function validateSections(
    sections: FormSectionState[],
    updatedField: FormFieldState,
    newState: FormState
): ValidationError[] {
    return sections.flatMap(section => {
        if (section?.subsections) {
            const maybeValidatedSection = isFieldInSection(section, updatedField)
                ? validateSection(section, updatedField, newState)
                : [];
            return [
                ...maybeValidatedSection,
                ...validateSections(section?.subsections, updatedField, newState),
            ];
        } else {
            return isFieldInSection(section, updatedField)
                ? validateSection(section, updatedField, newState)
                : [];
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