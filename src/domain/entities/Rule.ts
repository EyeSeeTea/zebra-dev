export type Rule = RuleToggleSectionsVisibilityByFieldValue;

type RuleToggleSectionsVisibilityByFieldValue = {
    type: "toggleSectionsVisibilityByFieldValue";
    fieldId: string;
    fieldValue: unknown;
    sectionIds: string[];
};
