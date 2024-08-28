import {
    ConfigurableForm,
    DiseaseOutbreakEventFormData,
} from "../../../../../domain/entities/ConfigurableForm";
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
import { mapFormStateToEntityData } from "./mapFormStateToEntityData";

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
    switch (configurableForm.data.type) {
        case "disease-outbreak-event":
            return validateDiseaseOutbreakEventFormState(
                updatedForm,
                updatedField,
                configurableForm.data,
                currentUserUsername
            );
        case "risk-assessment":
            return validateRiskAssessmentFormState(
                updatedForm,
                updatedField,
                configurableForm,
                currentUserUsername
            );
    }
}

//SNEHA TO DO : Combine below functions further and maybe move to domain

function validateDiseaseOutbreakEventFormState(
    updatedForm: FormState,
    updatedField: FormFieldState,
    configurableForm: DiseaseOutbreakEventFormData,
    currentUserUsername: string
): ValidationError[] {
    const formValidationErrors = validateForm(updatedForm, updatedField);
    const dieaseOutbreak = mapFormStateToEntityData(
        updatedForm,
        currentUserUsername,
        configurableForm
    );
    const entityValidationErrors = DiseaseOutbreakEvent.validate(dieaseOutbreak);

    return [...formValidationErrors, ...entityValidationErrors];
}

function validateRiskAssessmentFormState(
    updatedForm: FormState,
    updatedField: FormFieldState,
    _configirableForm: ConfigurableForm,
    _currentUserUsername: string
): ValidationError[] {
    const formValidationErrors = validateForm(updatedForm, updatedField);
    const entityValidationErrors: ValidationError[] = []; //SNEHA TO DO : Risk assessment validations, if any?

    return [...formValidationErrors, ...entityValidationErrors];
}
