import { DiseaseOutbreakEvent } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import { ValidationError } from "../../../../../domain/entities/ValidationError";
import {
    FormFieldState,
    FormState,
    isValidForm,
    updateFormStateAndApplySideEffects,
    updateFormStateWithFieldErrors,
    validateForm,
} from "../../../../components/form/FormState";
import { mapFormStateToEntityData } from "./diseaseOutbreakEventFormMapper";

export function updateDiseaseOutbreakEventFormState(
    prevFormState: FormState,
    updatedField: FormFieldState,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions,
    currentUserUsername: string
): FormState {
    const updatedForm = updateFormStateAndApplySideEffects(prevFormState, updatedField);

    const fieldValidationErrors = validateDiseaseOutbreakEventFormState(
        updatedForm,
        updatedField,
        diseaseOutbreakEventWithOptions,
        currentUserUsername
    );

    const updatedFormStateWithErrors = updateFormStateWithFieldErrors(
        updatedForm,
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
