import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { ResourceDocument, ResourceType, Template } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

type ResourceData = {
    templates: Template[];
    resourceDocuments: ResourceDocument[];
};

export class GetResourcesUseCase {
    constructor(
        private options: {
            resourceRepository: ResourceRepository;
        }
    ) {}

    public execute(): FutureData<ResourceData> {
        return this.options.resourceRepository.getAllResources().flatMap(resources => {
            const templates = resources.filter(
                resource => resource.resourceType === ResourceType.TEMPLATE
            ) as Template[];
            const resourceDocuments = resources.filter(
                resource => resource.resourceType === ResourceType.RESOURCE_DOCUMENT
            ) as ResourceDocument[];

            return Future.success({ templates: templates, resourceDocuments: resourceDocuments });
        });
    }
}
