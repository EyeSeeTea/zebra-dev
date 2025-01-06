import { ResourceFormData } from "../../../domain/entities/ConfigurableForm";
import { Future } from "../../../domain/entities/generic/Future";
import { Resource, ResourceType } from "../../../domain/entities/resources/Resource";
import { ResourceRepository } from "../../../domain/repositories/ResourceRepository";
import { FutureData } from "../../api-futures";

export class ResourceTestRepository implements ResourceRepository {
    getAllResources(): FutureData<Resource[]> {
        const resources: Resource[] = [
            {
                resourceLabel: "Incident Action Plan",
                resourceType: ResourceType.TEMPLATE,
            },
            {
                resourceLabel: "Excel line list",
                resourceType: ResourceType.RESOURCE_DOCUMENT,
                resourceFolder: "Case line lists",
            },
        ];

        return Future.success(resources);
    }

    saveResource(_formData: ResourceFormData): FutureData<void> {
        return Future.success(undefined);
    }

    deleteResource(): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
