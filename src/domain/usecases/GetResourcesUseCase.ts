import { FutureData } from "../../data/api-futures";
import _c from "../entities/generic/Collection";
import { Future } from "../entities/generic/Future";
import { ResourceType, ResponseDocument, Template } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export type ResponseDocumentsByFolder = {
    resourceFolder: string;
    resourceType: ResourceType;
    resources: {
        resourceLabel: string;
    }[];
};

export type ResourceData = {
    templates: Template[];
    responseDocuments: ResponseDocumentsByFolder[];
};

export class GetResourcesUseCase {
    constructor(
        private options: {
            resourceRepository: ResourceRepository;
        }
    ) {}

    public execute(): FutureData<ResourceData> {
        return this.options.resourceRepository.getAllResources().flatMap(resources => {
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
                        resources: group.map(({ resourceLabel }) => ({ resourceLabel })),
                    };
                })
                .value();

            const templates = resources.filter(
                resource => resource.resourceType === ResourceType.TEMPLATE
            ) as Template[];

            return Future.success({
                templates: templates,
                responseDocuments: responseDocumentsByFolder,
            });
        });
    }
}
