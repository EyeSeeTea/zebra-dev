import { FutureData } from "../../data/api-futures";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class DeleteResourceFileUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(fileId: string): FutureData<void> {
        return this.resourceRepository.deleteResource(fileId);
    }
}
