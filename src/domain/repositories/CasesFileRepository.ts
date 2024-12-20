import { FutureData } from "../../data/api-futures";
import { CaseFile } from "../entities/CasesFile";
import { Id } from "../entities/Ref";

export interface CasesFileRepository {
    get(outbreakKey: string): FutureData<CaseFile>;
    getTemplate(): FutureData<CaseFile>;
    save(diseaseOutbreakEventId: Id, outbreakKey: string, file: CaseFile): FutureData<void>;
    delete(outbreakKey: string): FutureData<void>;
}
