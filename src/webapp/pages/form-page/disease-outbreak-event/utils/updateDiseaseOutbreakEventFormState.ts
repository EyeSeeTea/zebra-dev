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
import { mapFormStateToDiseaseOutbreakEventData } from "../mapFormStateToDiseaseOutbreakEventData";

export function updateAndValidateFormState(
    prevFormState: FormState,
    updatedField: FormFieldState,
    configirableForm: ConfigurableForm,
    currentUserUsername: string
): FormState {
    const updatedForm = updateFormStateAndApplySideEffects(prevFormState, updatedField);

    const updatedFormWithRulesApplied =
        configirableForm.rules.filter(rule => rule.fieldId === updatedField.id).length > 0
            ? applyRulesInFormState(updatedForm, updatedField, configirableForm.rules)
            : updatedForm;

    const fieldValidationErrors = validateFormState(
        updatedFormWithRulesApplied,
        updatedField,
        configirableForm,
        currentUserUsername
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
    configurableForm: ConfigurableForm,
    currentUserUsername: string
): ValidationError[] {
    const formValidationErrors = validateForm(updatedForm, updatedField);
    let entityValidationErrors: ValidationError[] = [];

    switch (configurableForm.type) {
        case "disease-outbreak-event": {
            const diseaseOutbreakEvent = mapFormStateToDiseaseOutbreakEventData(
                updatedForm,
                currentUserUsername,
                configurableForm
            );
            entityValidationErrors = DiseaseOutbreakEvent.validate(diseaseOutbreakEvent);
            break;
        }

        case "risk-assessment-grading":
            break;
    }

    return [...formValidationErrors, ...entityValidationErrors];
}
