import { Rule } from "../../../../../domain/entities/Rule";
import {
    FormFieldState,
    getFieldWithEmptyValue,
} from "../../../../components/form/FormFieldsState";
import { FormSectionState } from "../../../../components/form/FormSectionsState";
import { FormState } from "../../../../components/form/FormState";

export function applyRulesInFormState(
    currentFormState: FormState,
    updatedField: FormFieldState,
    formRules: Rule[]
): FormState {
    const filteredRulesByFieldId = formRules.filter(rule => rule.fieldId === updatedField.id);

    if (filteredRulesByFieldId.length === 0) {
        return currentFormState;
    }

    const formStateWithRulesApplied = filteredRulesByFieldId.reduce((formState, rule) => {
        switch (rule.type) {
            case "toggleSectionsVisibilityByFieldValue":
                return {
                    ...formState,
                    sections: formState.sections.map(section =>
                        toggleSectionVisibilityByFieldValue(section, updatedField.value, rule)
                    ),
                };
        }
    }, currentFormState);

    return formStateWithRulesApplied;
}

function toggleSectionVisibilityByFieldValue(
    section: FormSectionState,
    fieldValue: FormFieldState["value"],
    rule: Rule
): FormSectionState {
    if (rule.sectionIds.includes(section.id)) {
        const subsections = section.subsections?.map(subsection => {
            return toggleSectionVisibilityByFieldValue(subsection, fieldValue, rule);
        });
        return section.subsections
            ? {
                  ...section,
                  subsections: subsections,
                  isVisible: fieldValue === rule.fieldValue,
                  fields:
                      fieldValue === rule.fieldValue
                          ? section.fields.map(field => ({
                                ...field,
                                isVisible: true,
                            }))
                          : hideFieldsAndSetToEmpty(section.fields),
              }
            : {
                  ...section,
                  isVisible: fieldValue === rule.fieldValue,
                  fields:
                      fieldValue === rule.fieldValue
                          ? section.fields.map(field => ({
                                ...field,
                                isVisible: true,
                            }))
                          : hideFieldsAndSetToEmpty(section.fields),
              };
    }

    return {
        ...section,
        subsections: section.subsections?.map(subsection =>
            toggleSectionVisibilityByFieldValue(subsection, fieldValue, rule)
        ),
    };
}

function hideFieldsAndSetToEmpty(fields: FormFieldState[]): FormFieldState[] {
    return fields.map(field => {
        const fieldWithEmptyValue = getFieldWithEmptyValue(field);

        return {
            ...fieldWithEmptyValue,
            isVisible: false,
        };
    });
}
