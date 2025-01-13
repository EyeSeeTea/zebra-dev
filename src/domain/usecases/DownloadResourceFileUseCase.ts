import { FutureData } from "../../data/api-futures";
import { ResourceFile } from "../entities/resources/ResourceFile";
import { ResourceFileRepository } from "../repositories/ResourceFileRepository";

export class DownloadResourceFileUseCase {
    constructor(private resourceFileRepository: ResourceFileRepository) {}

    public execute(fileId: string): FutureData<ResourceFile> {
        return this.resourceFileRepository.downloadFile(fileId);
    }
}
