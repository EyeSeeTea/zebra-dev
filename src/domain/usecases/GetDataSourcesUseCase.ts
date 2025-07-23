import { FutureData } from "../../data/api-futures";
import { DataSource } from "../entities/DataSource";
import { DataSourceRepository } from "../repositories/DataSourceRepository";

export class GetDataSourcesUseCase {
    constructor(
        private options: {
            dataSourceRepository: DataSourceRepository;
        }
    ) {}

    public execute(): FutureData<DataSource[]> {
        return this.options.dataSourceRepository.getAll();
    }
}
