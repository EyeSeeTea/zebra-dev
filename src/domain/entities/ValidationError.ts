export type ValidationErrorKey =
    | "field_is_required"
    | "field_is_required_na"
    | "detected_before_emerged"
    | "notified_before_emerged";

export type ValidationError = {
    property: string;
    value: unknown;
    errors: ValidationErrorKey[];
};
