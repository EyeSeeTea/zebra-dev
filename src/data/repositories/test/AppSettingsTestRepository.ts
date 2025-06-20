import { AppSettings } from "../../../domain/entities/AppSettings";
import { Future } from "../../../domain/entities/generic/Future";
import { AppSettingsRepository } from "../../../domain/repositories/AppSettingsRepository";
import { FutureData } from "../../api-futures";

export class AppSettingsTestRepository implements AppSettingsRepository {
    get(): FutureData<AppSettings> {
        return Future.success({} as AppSettings);
    }
}
