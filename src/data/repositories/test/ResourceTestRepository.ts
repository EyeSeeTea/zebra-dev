import { Id } from "@eyeseetea/d2-api";
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
                resourceFileId: "123",
            },
            {
                resourceLabel: "Excel line list",
                resourceType: ResourceType.RESPONSE_DOCUMENT,
                resourceFolder: "Case line lists",
                resourceFileId: "456",
            },
        ];

        return Future.success(resources);
    }

    saveResource(_resource: Resource): FutureData<void> {
        return Future.success(undefined);
    }

    deleteResource(_fileId: Id): FutureData<void> {
        return Future.success(undefined);
    }
}
