import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { Resource } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(): FutureData<Resource[]> {
        return this.resourceRepository
            .getAllResources()
            .flatMap(resources => Future.success(resources));
    }
}
