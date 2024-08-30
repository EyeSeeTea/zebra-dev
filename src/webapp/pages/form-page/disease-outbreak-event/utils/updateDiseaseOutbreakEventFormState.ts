import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import { FormFieldState } from "../../../../components/form/FormFieldsState";
import {
    FormState,
    isValidForm,
    updateFormStateAndApplySideEffects,
    updateFormStateWithFieldErrors,
    validateForm,
} from "../../../../components/form/FormState";
import { applyRulesInFormState } from "./applyRulesInFormState";

export function updateDiseaseOutbreakEventFormState(
    prevFormState: FormState,
    updatedField: FormFieldState,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions
): FormState {
    const updatedForm = updateFormStateAndApplySideEffects(prevFormState, updatedField);

    const hasUpdatedFieldAnyRule =
        diseaseOutbreakEventWithOptions.rules.filter(rule => rule.fieldId === updatedField.id)
            .length > 0;

    const updatedFormWithRulesApplied = hasUpdatedFieldAnyRule
        ? applyRulesInFormState(updatedForm, updatedField, diseaseOutbreakEventWithOptions.rules)
        : updatedForm;

    const fieldValidationErrors = validateForm(updatedFormWithRulesApplied, updatedField);

    const updatedFormStateWithErrors = updateFormStateWithFieldErrors(
        updatedFormWithRulesApplied,
        updatedField,
        fieldValidationErrors
    );

    return {
        ...updatedFormStateWithErrors,
        isValid: isValidForm(updatedFormStateWithErrors.sections),
    };
}
