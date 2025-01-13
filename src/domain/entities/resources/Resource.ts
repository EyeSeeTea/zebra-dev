import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";

export enum ResourceType {
    TEMPLATE = "template",
    RESPONSE_DOCUMENT = "response-document",
}

export type ResourceBase = {
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

export type Resource = ResponseDocument | Template;

export function isResponseDocument(resource: Resource): resource is ResponseDocument {
    return resource.resourceType === ResourceType.RESPONSE_DOCUMENT;
}

export function isTemplate(resource: Resource): resource is Template {
    return resource.resourceType === ResourceType.TEMPLATE;
}

export function isExistingResource(resources: Resource[], resource: Resource): boolean {
    return resources.some(existingResource => {
        const isSameType = existingResource.resourceType === resource.resourceType;
        const isResponseDoc = isResponseDocument(resource);
        const isExistingResponseDoc = isResponseDocument(existingResource);
        const isTemplateResource = isTemplate(resource);
        const isSameLabel = existingResource.resourceLabel === resource.resourceLabel;

        if (isResponseDoc && isExistingResponseDoc) {
            return resource.resourceFolder === existingResource.resourceFolder && isSameLabel;
        } else if (isTemplateResource) {
            return isSameType && isSameLabel;
        } else {
            return false;
        }
    });
}
