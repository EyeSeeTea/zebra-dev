import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { Resource } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(options?: { ids?: Id[]; diseaseOutbreakId?: Id }): FutureData<Resource[]> {
        return this.resourceRepository.getAll(options);
    }
}
