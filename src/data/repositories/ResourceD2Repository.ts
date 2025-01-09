import { D2Api } from "@eyeseetea/d2-api/2.36";
import { ResourceRepository } from "../../domain/repositories/ResourceRepository";
import { DataStoreClient } from "../DataStoreClient";
import { Resource, ResourceFile } from "../../domain/entities/resources/Resource";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { ResourceFormData } from "../../domain/entities/ConfigurableForm";
import { Id } from "../../domain/entities/Ref";
import _c from "../../domain/entities/generic/Collection";

const RESOURCES_KEY = "resources";

export class ResourceD2Repository implements ResourceRepository {
    private dataStoreClient: DataStoreClient;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
    }

    getAllResources(): FutureData<Resource[]> {
        return this.dataStoreClient
            .getObject<Resource[]>(RESOURCES_KEY)
            .flatMap(resources => Future.success(resources ?? []));
    }

    // should this be in it's own ResourceFileRepository? or should it be a useCase?
    downloadFile(fileId: Id): FutureData<ResourceFile> {
        if (!fileId) return Future.error(new Error("No file id found"));

        return apiToFuture(this.api.files.get(fileId))
            .map(blob => {
                return new File([blob], "file", { type: "application/pdf" });
            })
            .flatMap(file =>
                Future.success({
                    fileId: fileId,
                    file: file,
                })
            );
    }

    saveResource(formData: ResourceFormData): FutureData<void> {
        const { entity: resource, uploadedResourceFile } = formData;

        if (!resource) throw new Error("No resource form data found");
        if (!uploadedResourceFile) return Future.error(new Error("No file uploaded"));

        return this.getAllResources().flatMap(resourcesInDataStore => {
            return this.uploadFile(uploadedResourceFile).flatMap(resourceFileId => {
                const updatedResources = this.getResourcesToSave(
                    resourcesInDataStore,
                    resource,
                    resourceFileId
                );

                return this.dataStoreClient.saveObject<Resource[]>(RESOURCES_KEY, updatedResources);
            });
        });
    }

    private getResourcesToSave(
        resourcesInDataStore: Resource[],
        resource: Resource,
        resourceFileId: string
    ) {
        const isResourceExisting = resourcesInDataStore.some(resourceInDataStore => {
            const isMatchingResourceType =
                resourceInDataStore.resourceType === resource.resourceType;
            const isMatchingResourceLabel =
                resourceInDataStore.resourceLabel === resource.resourceLabel;

            return isMatchingResourceType && isMatchingResourceLabel;
        });

        const resourceWithFileId = { ...resource, resourceFileId: resourceFileId };
        const updatedResources = isResourceExisting
            ? resourcesInDataStore.map(resourceInDataStore =>
                  resourceInDataStore.resourceLabel === resource.resourceLabel
                      ? resourceWithFileId
                      : resourceInDataStore
              )
            : [...resourcesInDataStore, resourceWithFileId];
        return updatedResources;
    }

    private uploadFile(file: File): FutureData<Id> {
        return apiToFuture(
            this.api.files.upload({
                name: file.name,
                data: file,
            })
        ).flatMap(fileResource => Future.success(fileResource.id));
    }

    deleteResource(fileId: Id): FutureData<void> {
        return apiToFuture(this.api.files.delete(fileId)).flatMap(response => {
            if (response.httpStatus === "OK") {
                return this.getAllResources().flatMap(resources => {
                    const updatedResources = resources.filter(
                        resource => resource.resourceFileId !== fileId
                    );

                    return this.dataStoreClient.saveObject<Resource[]>(
                        RESOURCES_KEY,
                        updatedResources
                    );
                });
            } else {
                return Future.error(new Error("Error while deleting resource file"));
            }
        });
    }
}
