export enum ResourceType {
    TEMPLATE = "template",
    RESPONSE_DOCUMENT = "response-document",
    DISEASE_OUTBREAK_EVENT_DOCUMENT = "disease-outbreak-event-document",
}

export type ResourceTypeNamed = {
    id: ResourceType;
    name: string;
};
