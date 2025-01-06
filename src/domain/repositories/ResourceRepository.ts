import { FutureData } from "../../data/api-futures";
import { ResourceFormData } from "../entities/ConfigurableForm";
import { Resource } from "../entities/resources/Resource";

export interface ResourceRepository {
    getAllResources(): FutureData<Resource[]>;
    saveResource(formData: ResourceFormData): FutureData<void>;
    deleteResource(): FutureData<void>;
}
