import { Rule } from "../../../domain/entities/Rule";
import { ValidationError } from "../../../domain/entities/ValidationError";
import {
    FormFieldState,
    getAllFieldsFromSections,
    isFieldInSection,
    getFieldWithEmptyValue,
    updateFields,
    validateField,
    hideFieldsAndSetToEmpty,
    AddNewFieldState,
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
    addNewField?: AddNewFieldState;
};

// HELPERS:

function hasSectionAFieldWithNotApplicable(sectionsState: FormSectionState) {
    return sectionsState.fields.some(field => field.hasNotApplicable);
}

export function getFieldValueByIdFromSections(
    sectionsState: FormSectionState[],
    fieldId: string
): FormFieldState["value"] | undefined {
    const section = sectionsState.find(section =>
        section.fields.some(field => field.id === fieldId)
    );
    return section?.fields.find(field => field.id === fieldId)?.value;
}

// UPDATES:

export function applyEffectNotApplicableFieldUpdatedInSections(
    sectionsState: FormSectionState[]
): FormSectionState[] {
    return sectionsState.map(section => {
        if (section.subsections?.length) {
            const maybeAppliedEffect = hasSectionAFieldWithNotApplicable(section)
                ? applyEffectNotApplicableFieldUpdatedInSection(section)
                : section;
            return {
                ...maybeAppliedEffect,
                subsections: applyEffectNotApplicableFieldUpdatedInSections(section.subsections),
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

                const fieldWithMaybeEmptyValue = notApplicableField?.value
                    ? getFieldWithEmptyValue(field)
                    : field;

                return {
                    ...fieldWithMaybeEmptyValue,
                    disabled: !!notApplicableField?.value,
                };
            } else {
                return field;
            }
        }),
    };
}

export function updateSections(
    formSectionsState: FormSectionState[],
    updatedField: FormFieldState,
    fieldValidationErrors?: ValidationError[]
): FormSectionState[] {
    return formSectionsState.map(section => {
        const hasToUpdateSection =
            isFieldInSection(section, updatedField) ||
            updatedField.updateAllStateWithValidationErrors;
        if (section.subsections?.length) {
            const maybeUpdatedSection = hasToUpdateSection
                ? updateSectionState(section, updatedField, fieldValidationErrors)
                : section;
            return {
                ...maybeUpdatedSection,
                subsections: updateSections(
                    section.subsections,
                    updatedField,
                    fieldValidationErrors
                ),
            };
        } else {
            return hasToUpdateSection
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
    if (
        isFieldInSection(formSectionState, updatedField) ||
        updatedField.updateAllStateWithValidationErrors
    ) {
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
        if (section.subsections?.length) {
            const maybeValidatedSection = isFieldInSection(section, updatedField)
                ? validateSection(section, updatedField, newState)
                : [];
            return [
                ...maybeValidatedSection,
                ...validateSections(section.subsections, updatedField, newState),
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
        } else {
            return [];
        }
    });
}

// RULES:

export function toggleSectionVisibilityByFieldValue(
    section: FormSectionState,
    fieldValue: FormFieldState["value"],
    rule: Rule
): FormSectionState {
    if (rule.type !== "toggleSectionsVisibilityByFieldValue") return section;

    if (rule.sectionIds.includes(section.id)) {
        const subsections = section.subsections?.map(subsection => {
            return toggleSectionVisibilityByFieldValue(subsection, fieldValue, rule);
        });

        const sectionToggleVisibility = {
            isVisible: fieldValue === rule.fieldValue,
            fields:
                fieldValue === rule.fieldValue
                    ? section.fields.map(field => ({
                          ...field,
                          isVisible: true,
                      }))
                    : hideFieldsAndSetToEmpty(section.fields),
        };

        return section.subsections
            ? {
                  ...section,
                  ...sectionToggleVisibility,
                  subsections: subsections,
              }
            : {
                  ...section,
                  ...sectionToggleVisibility,
              };
    } else {
        return {
            ...section,
            subsections: section.subsections?.map(subsection =>
                toggleSectionVisibilityByFieldValue(subsection, fieldValue, rule)
            ),
        };
    }
}

export function disableFieldsByFieldValueInSection(
    section: FormSectionState,
    fieldValue: FormFieldState["value"],
    rule: Rule
): FormSectionState {
    if (rule.type !== "disableFieldsByFieldValue") return section;

    if (rule.sectionIdsWithDisableFields.includes(section.id)) {
        const subsections = section.subsections?.map(subsection => {
            return disableFieldsByFieldValueInSection(subsection, fieldValue, rule);
        });

        const fieldsInSection: FormFieldState[] = section.fields.map(field => {
            return rule.disableFieldIds.includes(field.id)
                ? {
                      ...field,
                      disabled: fieldValue === rule.fieldValue,
                  }
                : field;
        });

        return section.subsections
            ? {
                  ...section,
                  fields: fieldsInSection,
                  subsections: subsections,
              }
            : {
                  ...section,
                  fields: fieldsInSection,
              };
    } else {
        return {
            ...section,
            subsections: section.subsections?.map(subsection =>
                disableFieldsByFieldValueInSection(subsection, fieldValue, rule)
            ),
        };
    }
}

export function disableFieldOptionWithSameFieldValueInSection(
    section: FormSectionState,
    fieldValue: FormFieldState["value"],
    rule: Rule
): FormSectionState {
    if (rule.type !== "disableFieldOptionWithSameFieldValue") return section;

    if (rule.sectionsWithFieldsToDisableOption.includes(section.id)) {
        const subsections = section.subsections?.map(subsection => {
            return disableFieldOptionWithSameFieldValueInSection(subsection, fieldValue, rule);
        });

        const fieldsInSection: FormFieldState[] = section.fields.map(field => {
            return rule.fieldIdsToDisableOption.includes(field.id) &&
                (field.type === "select" || field.type === "user" || field.type === "radio")
                ? ({
                      ...field,
                      options: field.options?.map(option => ({
                          ...option,
                          disabled: option.value === fieldValue,
                      })),
                  } as FormFieldState)
                : field;
        });

        return section.subsections
            ? {
                  ...section,
                  fields: fieldsInSection,
                  subsections: subsections,
              }
            : {
                  ...section,
                  fields: fieldsInSection,
              };
    } else {
        return {
            ...section,
            subsections: section.subsections?.map(subsection =>
                disableFieldOptionWithSameFieldValueInSection(subsection, fieldValue, rule)
            ),
        };
    }
}
