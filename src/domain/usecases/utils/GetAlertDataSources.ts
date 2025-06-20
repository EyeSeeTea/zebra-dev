import { FutureData } from "../../../data/api-futures";
import { AlertDataSource } from "../../entities/alert/AlertDataSource";
import { AlertDataSourceRepository } from "../../repositories/AlertDataSourceRepository";

export class GetAlertDataSources {
    constructor(
        private options: {
            alertDataSourceRepository: AlertDataSourceRepository;
        }
    ) {}

    public execute(): FutureData<AlertDataSource[]> {
        return this.options.alertDataSourceRepository.getAll();
    }
}
