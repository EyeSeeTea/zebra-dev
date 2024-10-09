import { ConfigurableForm } from "../../../../../domain/entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ValidationError } from "../../../../../domain/entities/ValidationError";
import { FormFieldState } from "../../../../components/form/FormFieldsState";
import {
    FormState,
    isValidForm,
    updateFormStateAndApplySideEffects,
    updateFormStateWithFieldErrors,
    validateForm,
} from "../../../../components/form/FormState";
import { applyRulesInFormState } from "./applyRulesInFormState";

export function updateAndValidateFormState(
    prevFormState: FormState,
    updatedField: FormFieldState,
    configurableForm: ConfigurableForm
): FormState {
    const updatedForm = updateFormStateAndApplySideEffects(prevFormState, updatedField);

    const hasUpdatedFieldAnyRule =
        configurableForm.rules.filter(rule => rule.fieldId === updatedField.id).length > 0;

    const updatedFormWithRulesApplied = hasUpdatedFieldAnyRule
        ? applyRulesInFormState(updatedForm, updatedField, configurableForm.rules)
        : updatedForm;

    const fieldValidationErrors = validateFormState(
        updatedFormWithRulesApplied,
        updatedField,
        configurableForm
    );

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

function validateFormState(
    updatedForm: FormState,
    updatedField: FormFieldState,
    configurableForm: ConfigurableForm
): ValidationError[] {
    const formValidationErrors = validateForm(updatedForm, updatedField);
    let entityValidationErrors: ValidationError[] = [];

    switch (configurableForm.type) {
        case "disease-outbreak-event": {
            if (configurableForm.entity)
                entityValidationErrors = DiseaseOutbreakEvent.validate(configurableForm.entity);
            break;
        }
        case "risk-assessment-grading":
            break;
        case "risk-assessment-summary":
            break;
        case "risk-assessment-questionnaire":
            break;
        case "incident-management-team-member-assignment":
            break;
    }

    return [...formValidationErrors, ...entityValidationErrors];
}
