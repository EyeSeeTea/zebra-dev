import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { Resource } from "../entities/resources/Resource";

export interface ResourceRepository {
    getAllResources(): FutureData<Resource[]>;
    saveResource(resource: Resource): FutureData<void>;
    deleteResource(fileId: Id): FutureData<void>;
}
