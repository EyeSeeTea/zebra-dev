import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";
import { ResourceType } from "./ResourceTypeNamed";

export type ResourceBase = {
    id: Id;
    type: ResourceType;
    name: string;
    fileId: Maybe<Id>;
};

export type ResponseDocument = ResourceBase & {
    type: ResourceType.RESPONSE_DOCUMENT;
    folder: string;
};

export type Template = ResourceBase & {
    type: ResourceType.TEMPLATE;
};

export type DiseaseOutbreakEventDocument = ResourceBase & {
    type: ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT;
    folder: string;
    diseaseOutbreakEventId: Id;
};

export type Resource = ResponseDocument | Template | DiseaseOutbreakEventDocument;

export function isResponseDocument(resource: Resource): resource is ResponseDocument {
    return resource.type === ResourceType.RESPONSE_DOCUMENT;
}

export function isTemplate(resource: Resource): resource is Template {
    return resource.type === ResourceType.TEMPLATE;
}

export function isDiseaseOutbreakEventDocument(
    resource: Resource
): resource is DiseaseOutbreakEventDocument {
    return resource.type === ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT;
}

const validResourceTypes = new Set<string>(Object.values(ResourceType));

export function isResouceType(type: unknown): type is ResourceType {
    return typeof type === "string" && validResourceTypes.has(type);
}
