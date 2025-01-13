import { FutureData } from "../../data/api-futures";
import { ResourceFormData } from "../entities/ConfigurableForm";
import { Id } from "../entities/Ref";
import { Resource } from "../entities/resources/Resource";

export interface ResourceRepository {
    getAllResources(): FutureData<Resource[]>;
    saveResource(formData: ResourceFormData): FutureData<void>;
    deleteResource(fileId: Id): FutureData<void>;
}
