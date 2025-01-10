import { Maybe } from "../../utils/ts-utils";

export type ValidationErrorKey =
    | "field_is_required"
    | "field_is_required_na"
    | "cannot_create_cyclycal_dependency"
    | "file_missing"
    | "file_empty"
    | "file_headers_missing"
    | "file_dates_missing"
    | "file_dates_not_unique"
    | "file_org_units_incorrect"
    | "file_data_not_number";

export type ValidationError = {
    property: string;
    value: string | boolean | Date | Maybe<string> | string[] | null | Maybe<File>;
    errors: ValidationErrorKey[];
    errorsInFile?: Partial<Record<ValidationErrorKey, string>>;
};
