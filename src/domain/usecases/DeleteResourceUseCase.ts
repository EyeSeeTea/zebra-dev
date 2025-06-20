import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { ResourceFileRepository } from "../repositories/ResourceFileRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class DeleteResourceUseCase {
    constructor(
        private options: {
            resourceRepository: ResourceRepository;
            resourceFileRepository: ResourceFileRepository;
        }
    ) {}

    public execute(id: Id, fileId: Id): FutureData<void> {
        return this.options.resourceRepository
            .deleteById(id)
            .flatMap(() => this.options.resourceFileRepository.deleteResourceFile(fileId));
    }
}
