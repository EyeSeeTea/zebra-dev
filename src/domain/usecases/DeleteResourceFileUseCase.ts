import { FutureData } from "../../data/api-futures";
import { ResourceFileRepository } from "../repositories/ResourceFileRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class DeleteResourceFileUseCase {
    constructor(
        private options: {
            resourceRepository: ResourceRepository;
            resourceFileRepository: ResourceFileRepository;
        }
    ) {}

    public execute(fileId: string): FutureData<void> {
        return this.options.resourceFileRepository
            .deleteResourceFile(fileId)
            .flatMap(() => this.options.resourceRepository.deleteResource(fileId));
    }
}
