import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";

export type ResourceFile = {
    fileId: Id;
    file: File;
};

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
