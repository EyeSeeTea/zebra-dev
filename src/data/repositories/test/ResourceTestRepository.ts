import { Id } from "@eyeseetea/d2-api";
import { Future } from "../../../domain/entities/generic/Future";
import { Resource } from "../../../domain/entities/resources/Resource";
import { ResourceRepository } from "../../../domain/repositories/ResourceRepository";
import { FutureData } from "../../api-futures";
import { ResourceType } from "../../../domain/entities/resources/ResourceTypeNamed";

export class ResourceTestRepository implements ResourceRepository {
    getAll(_options?: { ids?: Id[]; diseaseOutbreakId?: Id }): FutureData<Resource[]> {
        const resources: Resource[] = [
            {
                id: "1",
                resourceLabel: "Incident Action Plan",
                resourceType: ResourceType.TEMPLATE,
                resourceFileId: "123",
            },
            {
                id: "2",
                resourceLabel: "Excel line list",
                resourceType: ResourceType.RESPONSE_DOCUMENT,
                resourceFolder: "Case line lists",
                resourceFileId: "456",
            },
            {
                id: "3",
                resourceLabel: "Excel line list",
                resourceType: ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT,
                resourceFolder: "Test folder",
                resourceFileId: "456",
                diseaseOutbreakEventId: "789",
            },
        ];

        return Future.success(resources);
    }

    save(_resource: Resource): FutureData<void> {
        return Future.success(undefined);
    }

    deleteById(_id: Id): FutureData<void> {
        return Future.success(undefined);
    }
}
