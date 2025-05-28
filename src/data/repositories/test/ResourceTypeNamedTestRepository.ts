import { Future } from "../../../domain/entities/generic/Future";
import { ResourceTypeNamed } from "../../../domain/entities/resources/ResourceTypeNamed";
import { ResourceTypeNamedRepository } from "../../../domain/repositories/ResourceTypeNamedRepository";
import { FutureData } from "../../api-futures";

export class ResourceTypeNamedTestRepository implements ResourceTypeNamedRepository {
    public get(): FutureData<ResourceTypeNamed[]> {
        return Future.success([]);
    }
}
