import { MainSyndrome } from "../../../domain/entities/disease-outbreak-event/MainSyndrome";
import { Future } from "../../../domain/entities/generic/Future";
import { MainSyndromeRepository } from "../../../domain/repositories/MainSyndromeRepository";
import { FutureData } from "../../api-futures";

export class MainSyndromeTestRepository implements MainSyndromeRepository {
    getAll(): FutureData<MainSyndrome[]> {
        return Future.success([]);
    }
}
