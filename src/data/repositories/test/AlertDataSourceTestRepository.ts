import { AlertDataSource } from "../../../domain/entities/alert/AlertDataSource";
import { Future } from "../../../domain/entities/generic/Future";
import { AlertDataSourceRepository } from "../../../domain/repositories/AlertDataSourceRepository";
import { FutureData } from "../../api-futures";

export class AlertDataSourceTestRepository implements AlertDataSourceRepository {
    getAll(): FutureData<AlertDataSource[]> {
        return Future.success([]);
    }
}
