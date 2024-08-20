import { DiseaseOutbreakEvent } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
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
import { mapFormStateToEntityData } from "./mapFormStateToEntityData";

export function updateDiseaseOutbreakEventFormState(
    prevFormState: FormState,
    updatedField: FormFieldState,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions,
    currentUserUsername: string
): FormState {
    const updatedForm = updateFormStateAndApplySideEffects(prevFormState, updatedField);
    const updatedFormWithRulesApplied = diseaseOutbreakEventWithOptions.rules.length
        ? applyRulesInFormState(updatedForm, updatedField, diseaseOutbreakEventWithOptions.rules)
        : updatedForm;

    const fieldValidationErrors = validateDiseaseOutbreakEventFormState(
        updatedFormWithRulesApplied,
        updatedField,
        diseaseOutbreakEventWithOptions,
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

export function validateDiseaseOutbreakEventFormState(
    updatedForm: FormState,
    updatedField: FormFieldState,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions,
    currentUserUsername: string
): ValidationError[] {
    const formValidationErrors = validateForm(updatedForm, updatedField);
    const entityValidationErrors = DiseaseOutbreakEvent.validate(
        mapFormStateToEntityData(updatedForm, currentUserUsername, diseaseOutbreakEventWithOptions)
    );

    return [...formValidationErrors, ...entityValidationErrors];
}
