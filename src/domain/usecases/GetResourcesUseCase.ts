import { FutureData } from "../../data/api-futures";
import { Resource } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(): FutureData<Resource[]> {
        return this.resourceRepository.getAllResources();
    }
}
