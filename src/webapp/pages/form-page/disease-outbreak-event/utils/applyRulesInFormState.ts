import { Rule } from "../../../../../domain/entities/Rule";
import { FormFieldState } from "../../../../components/form/FormFieldsState";
import { toggleSectionVisibilityByFieldValue } from "../../../../components/form/FormSectionsState";
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
