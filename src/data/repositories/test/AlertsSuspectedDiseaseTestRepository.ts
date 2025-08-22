import { AlertsSuspectedDisease } from "../../../domain/entities/AlertsSuspectedDisease";
import { Future } from "../../../domain/entities/generic/Future";
import { AlertsSuspectedDiseaseRepository } from "../../../domain/repositories/AlertsSuspectedDiseaseRepository";
import { FutureData } from "../../api-futures";

export class AlertsSuspectedDiseaseTestRepository implements AlertsSuspectedDiseaseRepository {
    getAll(): FutureData<AlertsSuspectedDisease[]> {
        return Future.success([]);
    }
}
