import { Maybe } from "purify-ts";

export type Rule =
    | RuleToggleSectionsVisibilityByFieldValue
    | RuleDisableFieldByFieldValue
    | RuleDisableFieldOptionWithSameFieldValue;

type RuleToggleSectionsVisibilityByFieldValue = {
    type: "toggleSectionsVisibilityByFieldValue";
    fieldId: string;
    fieldValue: string | boolean | string[] | Date | Maybe<string> | null;
    sectionIds: string[];
};

type RuleDisableFieldByFieldValue = {
    type: "disableFieldsByFieldValue";
    fieldId: string;
    fieldValue: string | boolean | string[] | Date | Maybe<string> | null;
    disableFieldIds: string[];
    sectionIdsWithDisableFields: string[];
};

type RuleDisableFieldOptionWithSameFieldValue = {
    type: "disableFieldOptionWithSameFieldValue";
    fieldId: string;
    fieldIdsToDisableOption: string[];
    sectionsWithFieldsToDisableOption: string[];
};
