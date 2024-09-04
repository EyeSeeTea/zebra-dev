import { Maybe } from "../../utils/ts-utils";

export type ValidationErrorKey = "field_is_required" | "field_is_required_na";

export type ValidationError = {
    property: string;
    value: string | boolean | Date | Maybe<string> | string[] | null;
    errors: ValidationErrorKey[];
};
