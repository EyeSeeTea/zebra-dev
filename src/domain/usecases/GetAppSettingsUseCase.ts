import { FutureData } from "../../data/api-futures";
import { AppSettings } from "../entities/AppSettings";
import { AppSettingsRepository } from "../repositories/AppSettingsRepository";

export class GetAppSettingsUseCase {
    constructor(
        private options: {
            appSettingsRepository: AppSettingsRepository;
        }
    ) {}

    public execute(): FutureData<AppSettings> {
        return this.options.appSettingsRepository.get();
    }
}
