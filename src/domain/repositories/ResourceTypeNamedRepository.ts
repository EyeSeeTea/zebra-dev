import { FutureData } from "../../data/api-futures";
import { ResourceTypeNamed } from "../entities/resources/ResourceTypeNamed";

export interface ResourceTypeNamedRepository {
    get(): FutureData<ResourceTypeNamed[]>;
}
