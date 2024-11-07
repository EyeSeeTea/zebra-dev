import { incidentManagementTeamBuilderCodesWithoutRoles } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { ConfigurableForm } from "../../../../domain/entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventAggregateRoot } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { ValidationError } from "../../../../domain/entities/ValidationError";
import { FormFieldState } from "../../../components/form/FormFieldsState";
import { getFieldValueByIdFromSections } from "../../../components/form/FormSectionsState";
import {
    FormState,
    isValidForm,
    updateFormStateAndApplySideEffects,
    updateFormStateWithFieldErrors,
    validateForm,
} from "../../../components/form/FormState";
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
        case "incident-action-plan":
            break;
        case "incident-response-action":
            break;
        case "incident-management-team-member-assignment": {
            const reportsToUsername = getFieldValueByIdFromSections(
                updatedForm.sections,
                incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername
            ) as string | undefined;
            const teamMemberAssigned = getFieldValueByIdFromSections(
                updatedForm.sections,
                incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned
            ) as string | undefined;

            return DiseaseOutbreakEventAggregateRoot.validateNotCyclicalDependencyInIncidentManagementTeam(
                teamMemberAssigned,
                reportsToUsername,
                configurableForm?.currentIncidentManagementTeam?.teamHierarchy || [],
                updatedField.id
            );
            break;
        }
    }

    return [...formValidationErrors, ...entityValidationErrors];
}
