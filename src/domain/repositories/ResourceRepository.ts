import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { Resource } from "../entities/resources/Resource";

export interface ResourceRepository {
    getAll(options?: { ids?: Id[]; diseaseOutbreakId?: Id }): FutureData<Resource[]>;
    deleteById(id: Id): FutureData<void>;
    save(resource: Resource): FutureData<void>;
}
