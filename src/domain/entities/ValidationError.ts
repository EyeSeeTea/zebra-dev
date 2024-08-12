export type ValidationErrorKey = "field_is_required" | "field_is_required_na";

export type ValidationError = {
    property: string;
    value: unknown;
    errors: ValidationErrorKey[];
};
