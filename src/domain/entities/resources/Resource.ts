import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";
import { ResourceType } from "./ResourceTypeNamed";

export type ResourceBase = {
    id: Id;
    resourceType: ResourceType;
    resourceLabel: string;
    resourceFileId: Maybe<Id>;
};

export type ResponseDocument = ResourceBase & {
    resourceType: ResourceType.RESPONSE_DOCUMENT;
    resourceFolder: string;
};

export type Template = ResourceBase & {
    resourceType: ResourceType.TEMPLATE;
};

export type DiseaseOutbreakEventDocument = ResourceBase & {
    resourceType: ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT;
    resourceFolder: string;
    diseaseOutbreakEventId: Id;
};

export type Resource = ResponseDocument | Template | DiseaseOutbreakEventDocument;

export function isResponseDocument(resource: Resource): resource is ResponseDocument {
    return resource.resourceType === ResourceType.RESPONSE_DOCUMENT;
}

export function isTemplate(resource: Resource): resource is Template {
    return resource.resourceType === ResourceType.TEMPLATE;
}

export function isDiseaseOutbreakEventDocument(
    resource: Resource
): resource is DiseaseOutbreakEventDocument {
    return resource.resourceType === ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT;
}

const validResourceTypes = new Set<string>(Object.values(ResourceType));

export function isResouceType(resourceType: unknown): resourceType is ResourceType {
    return typeof resourceType === "string" && validResourceTypes.has(resourceType);
}
