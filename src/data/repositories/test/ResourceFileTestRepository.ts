import { Id } from "@eyeseetea/d2-api";
import { Future } from "../../../domain/entities/generic/Future";
import { FutureData } from "../../api-futures";
import { ResourceFileRepository } from "../../../domain/repositories/ResourceFileRepository";
import { ResourceFile } from "../../../domain/entities/resources/ResourceFile";

export class ResourceFileTestRepository implements ResourceFileRepository {
    downloadFile(fileId: Id): FutureData<ResourceFile> {
        return Future.success({
            fileId: fileId,
            file: new File(["test"], "test.txt", { type: "text/plain" }),
        });
    }
}
