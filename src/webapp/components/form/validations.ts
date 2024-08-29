import { ValidationErrorKey } from "../../../domain/entities/ValidationError";
import { FieldType, FormFieldState } from "./FormFieldsState";

export function validateFieldRequired(
    value: FormFieldState["value"],
    fieldType: FieldType
): ValidationErrorKey[] {
    if (fieldType === "date") {
        const validDate = value instanceof Date && !isNaN(value.getTime());
        return !validDate ? ["field_is_required"] : [];
    } else if (fieldType === "select" && Array.isArray(value)) {
        return value.length === 0 ? ["field_is_required"] : [];
    } else if (fieldType === "boolean") {
        return value === undefined ? ["field_is_required"] : [];
    } else {
        return !value || value === "" ? ["field_is_required"] : [];
    }
}

export function validateFieldRequiredWithNotApplicable(
    value: FormFieldState["value"],
    fieldType: FieldType,
    notApplicableValue: boolean
): ValidationErrorKey[] {
    return validateFieldRequired(value, fieldType).length && !notApplicableValue
        ? ["field_is_required_na"]
        : [];
}
