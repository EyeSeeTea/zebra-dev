export enum ResourceType {
    TEMPLATE = "template",
    RESPONSE_DOCUMENT = "response-document",
}

type ResourceBase = {
    resourceType: ResourceType;
    resourceLabel: string;
};

export type ResponseDocument = ResourceBase & {
    resourceType: ResourceType.RESPONSE_DOCUMENT;
    resourceFolder: string;
};

export type Template = ResourceBase & {
    resourceType: ResourceType.TEMPLATE;
};

export type Resource = ResponseDocument | Template;
