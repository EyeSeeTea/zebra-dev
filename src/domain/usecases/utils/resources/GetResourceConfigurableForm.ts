import { FutureData } from "../../../../data/api-futures";
import { FormLables, ResourceFormData } from "../../../entities/ConfigurableForm";
import { Future } from "../../../entities/generic/Future";
import { ResourceType } from "../../../entities/resources/Resource";
import { Rule } from "../../../entities/Rule";

export function getResourceConfigurableForm(): FutureData<ResourceFormData> {
    const { rules, labels } = getResourceLabelsRules();

    const resourceFormData: ResourceFormData = {
        type: "resource",
        entity: undefined,
        uploadedResourceFile: undefined,
        uploadedResourceFileId: undefined,
        labels: labels,
        rules: rules,
    };

    return Future.success(resourceFormData);
}

function getResourceLabelsRules(): { rules: Rule[]; labels: FormLables } {
    return {
        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
                field_is_required_na: "This field is required when not applicable",
            },
        },
        // TODO: Get rules from Datastore used in applyRulesInFormState
        rules: [
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "resourceType",
                fieldValue: ResourceType.RESPONSE_DOCUMENT,
                sectionIds: ["resourceFolder_section"],
            },
        ],
    };
}
