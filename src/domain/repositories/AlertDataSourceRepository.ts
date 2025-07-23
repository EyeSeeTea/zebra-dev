import { FutureData } from "../../data/api-futures";
import { AlertDataSource } from "../entities/alert/AlertDataSource";

export interface AlertDataSourceRepository {
    getAll(): FutureData<AlertDataSource[]>;
}
