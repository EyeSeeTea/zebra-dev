import { FutureData } from "../../../../data/api-futures";
import { FormLables, ResourceFormData } from "../../../entities/ConfigurableForm";
import _c from "../../../entities/generic/Collection";
import { Future } from "../../../entities/generic/Future";
import { Option } from "../../../entities/Ref";
import { isResponseDocument, Resource, ResourceType } from "../../../entities/resources/Resource";
import { Rule } from "../../../entities/Rule";
import { ResourceRepository } from "../../../repositories/ResourceRepository";

const resourceTypeOptions: Option[] = [
    {
        id: ResourceType.RESPONSE_DOCUMENT,
        name: "Response document",
    },
    {
        id: ResourceType.TEMPLATE,
        name: "Template",
    },
];

export function getResourceConfigurableForm(props: {
    resourceRepository: ResourceRepository;
}): FutureData<ResourceFormData> {
    const { resourceRepository } = props;
    const { rules, labels } = getResourceLabelsRules();

    return resourceRepository.getAllResources().flatMap(resources => {
        const resourceFolderOptions = getResourceFolderOptions(resources);

        const resourceFormData: ResourceFormData = {
            type: "resource",
            entity: undefined,
            options: {
                resourceType: resourceTypeOptions,
                resourceFolder: resourceFolderOptions,
            },
            uploadedResourceFile: undefined,
            uploadedResourceFileId: undefined,
            labels: labels,
            rules: rules,
        };

        return Future.success(resourceFormData);
    });
}

function getResourceFolderOptions(resources: Resource[]): Option[] {
    const resourceFolders = _c(resources)
        .map(resource => (isResponseDocument(resource) ? resource.resourceFolder : undefined))
        .compact()
        .uniq()
        .value();

    const resourceFolderOptions: Option[] = resourceFolders.map(resourceFolder => ({
        id: resourceFolder,
        name: resourceFolder,
    }));
    return resourceFolderOptions;
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
