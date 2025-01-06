export enum ResourceType {
    TEMPLATE = "template",
    RESOURCE_DOCUMENT = "resource-document",
}

export type Resource = {
    resourceType: ResourceType;
};
