import { FutureData } from "../../data/api-futures";
import { AppConfigurations } from "../entities/AppConfigurations";

export interface AppConfigurationRepository {
    getAppConfigurations(): FutureData<AppConfigurations>;
}
