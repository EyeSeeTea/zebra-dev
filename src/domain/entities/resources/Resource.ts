export enum ResourceType {
    TEMPLATE = "template",
    RESOURCE_DOCUMENT = "resource-document",
}

type ResourceBase = {
    resourceType: ResourceType;
    resourceLabel: string;
};

export type ResourceDocument = ResourceBase & {
    resourceType: ResourceType.RESOURCE_DOCUMENT;
    resourceFolder: string;
};

export type Template = ResourceBase & {
    resourceType: ResourceType.TEMPLATE;
};

export type Resource = ResourceDocument | Template;
