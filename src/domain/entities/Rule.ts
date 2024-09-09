import { Maybe } from "purify-ts";

export type Rule = RuleToggleSectionsVisibilityByFieldValue;

type RuleToggleSectionsVisibilityByFieldValue = {
    type: "toggleSectionsVisibilityByFieldValue";
    fieldId: string;
    fieldValue: string | boolean | string[] | Date | Maybe<string> | null;
    sectionIds: string[];
};
