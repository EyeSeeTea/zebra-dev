import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import _c from "../entities/generic/Collection";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { Resource, ResourceType, ResponseDocument, Template } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export type ResponseDocumentsByFolder = {
    resourceFolder: string;
    resourceType: ResourceType;
    resources: {
        resourceFileId: Maybe<Id>;
        resourceLabel: string;
    }[];
};

export type ResourceData = {
    templates: Template[];
    responseDocuments: ResponseDocumentsByFolder[];
};

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(): FutureData<ResourceData> {
        return this.resourceRepository.getAllResources().flatMap(resources => {
            const responseDocumentsByFolder = this.getResponseDocumentsByFolder(resources);
            const templates = resources.filter(
                resource => resource.resourceType === ResourceType.TEMPLATE
            ) as Template[];

            return Future.success({
                templates: templates,
                responseDocuments: responseDocumentsByFolder,
            });
        });
    }

    private getResponseDocumentsByFolder(resources: Resource[]): ResponseDocumentsByFolder[] {
        const responseDocuments = resources.filter(
            resource => resource.resourceType === ResourceType.RESPONSE_DOCUMENT
        ) as ResponseDocument[];
        const groupedResources = _c(responseDocuments)
            .groupBy(responseDocument => responseDocument.resourceFolder)
            .values();

        const responseDocumentsByFolder: ResponseDocumentsByFolder[] = _c(groupedResources)
            .compactMap(group => {
                const responseDocument = group[0];
                if (!responseDocument) return undefined;

                return {
                    resourceFolder: responseDocument.resourceFolder,
                    resourceType: responseDocument.resourceType,
                    resources: group.map(({ resourceFileId, resourceLabel }) => ({
                        resourceFileId: resourceFileId,
                        resourceLabel: resourceLabel,
                    })),
                };
            })
            .value();

        return responseDocumentsByFolder;
    }
}
