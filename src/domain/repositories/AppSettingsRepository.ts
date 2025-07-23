import { FutureData } from "../../data/api-futures";
import { AppSettings } from "../entities/AppSettings";

export interface AppSettingsRepository {
    get(): FutureData<AppSettings>;
}
