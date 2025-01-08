import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { ResourceFormData } from "../entities/ConfigurableForm";
import { Id } from "../entities/Ref";
import { Resource, ResourceFile } from "../entities/resources/Resource";

export interface ResourceRepository {
    getAllResources(): FutureData<Resource[]>;
    downloadFile(fileId: Maybe<Id>): FutureData<ResourceFile>;
    saveResource(formData: ResourceFormData): FutureData<void>;
    deleteResource(): FutureData<void>;
}
