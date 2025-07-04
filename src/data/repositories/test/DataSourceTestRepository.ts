import { DataSource } from "../../../domain/entities/DataSource";
import { Future } from "../../../domain/entities/generic/Future";
import { DataSourceRepository } from "../../../domain/repositories/DataSourceRepository";
import { FutureData } from "../../api-futures";

export class DataSourceTestRepository implements DataSourceRepository {
    getAll(): FutureData<DataSource[]> {
        return Future.success([]);
    }
}
