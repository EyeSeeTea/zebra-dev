import { D2Api } from "@eyeseetea/d2-api/2.36";
import { ResourceRepository } from "../../domain/repositories/ResourceRepository";
import { DataStoreClient } from "../DataStoreClient";
import { Resource } from "../../domain/entities/resources/Resource";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { ResourceFormData } from "../../domain/entities/ConfigurableForm";

const RESOURCES_KEY = "resources";

export class ResourceDataStoreRepository implements ResourceRepository {
    private dataStoreClient: DataStoreClient;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
    }

    getAllResources(): FutureData<Resource[]> {
        return this.dataStoreClient
            .getObject<Resource[]>(RESOURCES_KEY)
            .flatMap(resources => Future.success(resources ?? []));
    }

    saveResource(formData: ResourceFormData): FutureData<void> {
        const { entity: resource } = formData;
        if (!resource) throw new Error("No resource form data found");

        return this.getAllResources().flatMap(resourcesInDataStore => {
            const updatedResources = resourcesInDataStore.some(
                resourceInDataStore => resourceInDataStore.resourceLabel === resource.resourceLabel
            )
                ? resourcesInDataStore.map(resourceInDataStore =>
                      resourceInDataStore.resourceLabel === resource.resourceLabel
                          ? resource
                          : resourceInDataStore
                  )
                : [...resourcesInDataStore, resource];

            return this.dataStoreClient.saveObject<Resource[]>(RESOURCES_KEY, updatedResources);
        });
    }

    deleteResource(): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
