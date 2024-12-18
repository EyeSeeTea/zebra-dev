import { CaseFile } from "../../../domain/entities/CasesFile";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { CasesFileRepository } from "../../../domain/repositories/CasesFileRepository";
import { FutureData } from "../../api-futures";

export class CasesFileTestRepository implements CasesFileRepository {
    get(_outbreakKey: Id): FutureData<CaseFile> {
        return Future.success({
            file: new File([], "test"),
            fileId: "test",
        });
    }

    getTemplate(): FutureData<CaseFile> {
        return Future.success({
            file: new File([], "test"),
            fileId: "test",
        });
    }

    save(_diseaseOutbreakEventId: Id, _outbreakKey: string, _file: CaseFile): FutureData<void> {
        return Future.success(undefined);
    }

    delete(_outbreakKey: Id): FutureData<void> {
        return Future.success(undefined);
    }
}
