import { FutureData } from "../../data/api-futures";
import { DataSource } from "../entities/DataSource";

export interface DataSourceRepository {
    getAll(): FutureData<DataSource[]>;
}
