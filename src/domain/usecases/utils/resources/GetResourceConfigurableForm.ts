import { FutureData } from "../../../../data/api-futures";
import {
    FormLables,
    ResourceFolderOption,
    ResourceFormData,
} from "../../../entities/ConfigurableForm";
import _c from "../../../entities/generic/Collection";
import { Future } from "../../../entities/generic/Future";
import { Option } from "../../../entities/Ref";
import {
    isDiseaseOutbreakEventDocument,
    isResponseDocument,
    Resource,
} from "../../../entities/resources/Resource";
import { Rule } from "../../../entities/Rule";
import { ResourceRepository } from "../../../repositories/ResourceRepository";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { ResourceType } from "../../../entities/resources/ResourceTypeNamed";
import { ResourceTypeNamedRepository } from "../../../repositories/ResourceTypeNamedRepository";

export function getResourceConfigurableForm(options: {
    diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    resourceRepository: ResourceRepository;
    resourceTypeNamedRepository: ResourceTypeNamedRepository;
}): FutureData<ResourceFormData> {
    const { resourceRepository, diseaseOutbreakEventRepository, resourceTypeNamedRepository } =
        options;
    const { rules, labels } = getResourceLabelsRules();

    return Future.joinObj({
        activeDiseaseOutbreakEvents: diseaseOutbreakEventRepository.getAll(),
        resources: resourceRepository.getAll(),
        resourceTypeOptions: resourceTypeNamedRepository.get(),
    }).flatMap(({ activeDiseaseOutbreakEvents, resources, resourceTypeOptions }) => {
        const resourceFolderOptions = getResourceFolderOptions(resources);
        const activeDiseaseOutbreakEventsOptions: Option[] = activeDiseaseOutbreakEvents.map(
            event => ({
                id: event.id,
                name: event.name,
            })
        );

        const resourceFormData: ResourceFormData = {
            type: "resource",
            entity: undefined, // undefined because the form is always used to create a new resource.
            options: {
                resourceType: resourceTypeOptions,
                resourceFolder: resourceFolderOptions,
                activeDiseaseOutbreakEvents: activeDiseaseOutbreakEventsOptions,
            },
            uploadedResourceFile: undefined,
            labels: labels,
            rules: rules,
        };

        return Future.success(resourceFormData);
    });
}

function getResourceFolderOptions(resources: Resource[]): ResourceFolderOption[] {
    const resourcesByType = _c(resources).groupBy(resource => resource.type);

    const folderNamesByType = resourcesByType.mapValues(([_, group]) =>
        getUniqueFolderNames(group)
    );
    const resourceFolderOptions: ResourceFolderOption[] = folderNamesByType
        .toPairs()
        .flatMap(([resourceType, folderNames]) =>
            folderNames.map(folderName => ({
                id: folderName,
                name: folderName,
                resourceType: resourceType,
            }))
        );

    return resourceFolderOptions;
}

function getUniqueFolderNames(resources: Resource[]): string[] {
    return _c(resources)
        .map(resource =>
            isResponseDocument(resource) || isDiseaseOutbreakEventDocument(resource)
                ? resource.folder
                : undefined
        )
        .compact()
        .uniq()
        .value();
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
                sectionIds: ["responseResourceFolder_section"],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "resourceType",
                fieldValue: ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT,
                sectionIds: [
                    "eventResourceFolder_section",
                    "resourceDiseaseOutbreakEventId_section",
                ],
            },
        ],
    };
}
