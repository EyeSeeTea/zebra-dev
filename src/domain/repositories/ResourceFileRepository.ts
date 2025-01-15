import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { ResourceFile } from "../entities/resources/ResourceFile";

export interface ResourceFileRepository {
    uploadFile(file: File): FutureData<Id>;
    downloadFile(fileId: Id): FutureData<ResourceFile>;
}
