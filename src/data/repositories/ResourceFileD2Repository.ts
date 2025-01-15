import { D2Api } from "../../types/d2-api";
import { ResourceFile } from "../../domain/entities/resources/ResourceFile";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { Id } from "../../domain/entities/Ref";
import { ResourceFileRepository } from "../../domain/repositories/ResourceFileRepository";

export class ResourceFileD2Repository implements ResourceFileRepository {
    constructor(private api: D2Api) {}

    uploadFile(file: File): FutureData<Id> {
        return apiToFuture(
            this.api.files.upload({
                name: file.name,
                data: file,
            })
        ).flatMap(fileResource => Future.success(fileResource.id));
    }

    downloadFile(fileId: Id): FutureData<ResourceFile> {
        if (!fileId) return Future.error(new Error("No file id found"));

        return apiToFuture(this.api.files.get(fileId))
            .map(blob => {
                return new File([blob], "file", { type: "application/pdf" });
            })
            .flatMap(file =>
                Future.success({
                    fileId: fileId,
                    file: file,
                })
            );
    }
}
