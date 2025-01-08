import { Id } from "@eyeseetea/d2-api";
import { ResourceFormData } from "../../../domain/entities/ConfigurableForm";
import { Future } from "../../../domain/entities/generic/Future";
import { Resource, ResourceFile, ResourceType } from "../../../domain/entities/resources/Resource";
import { ResourceRepository } from "../../../domain/repositories/ResourceRepository";
import { FutureData } from "../../api-futures";
import { Maybe } from "../../../utils/ts-utils";

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

    downloadFile(_fileId: Maybe<Id>): FutureData<ResourceFile> {
        return Future.success({
            fileId: "123",
            file: new File(["test"], "test.txt", { type: "text/plain" }),
        });
    }

    saveResource(_formData: ResourceFormData): FutureData<void> {
        return Future.success(undefined);
    }

    deleteResource(): FutureData<void> {
        return Future.success(undefined);
    }
}
