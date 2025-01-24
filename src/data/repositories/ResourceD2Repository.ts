import { D2Api } from "../../types/d2-api";
import { ResourceRepository } from "../../domain/repositories/ResourceRepository";
import { DataStoreClient } from "../DataStoreClient";
import { isExistingResource, Resource } from "../../domain/entities/resources/Resource";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { Id } from "../../domain/entities/Ref";

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

    saveResource(resource: Resource): FutureData<void> {
        if (!resource) return Future.error(new Error("No resource form data found"));

        return this.getAllResources().flatMap(resourcesInDataStore => {
            const updatedResources = this.getResourcesToSave(resourcesInDataStore, resource);

            return this.dataStoreClient.saveObject<Resource[]>(RESOURCES_KEY, updatedResources);
        });
    }

    private getResourcesToSave(resourcesInDataStore: Resource[], resource: Resource) {
        const isResourceExisting = isExistingResource(resourcesInDataStore, resource);

        const updatedResources = isResourceExisting
            ? resourcesInDataStore.map(resourceInDataStore =>
                  isResourceExisting ? resource : resourceInDataStore
              )
            : [...resourcesInDataStore, resource];
        return updatedResources;
    }

    deleteResource(fileId: Id): FutureData<void> {
        return this.getAllResources().flatMap(resources => {
            const updatedResources = resources.filter(
                resource => resource.resourceFileId !== fileId
            );

            return this.dataStoreClient.saveObject<Resource[]>(RESOURCES_KEY, updatedResources);
        });
    }
}
