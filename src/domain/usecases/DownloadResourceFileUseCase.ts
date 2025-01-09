import { FutureData } from "../../data/api-futures";
import { ResourceFile } from "../entities/resources/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class DownloadResourceFileUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(fileId: string): FutureData<ResourceFile> {
        return this.resourceRepository.downloadFile(fileId);
    }
}
