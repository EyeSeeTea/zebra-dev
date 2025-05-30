import { FutureData } from "../../data/api-futures";
import { AppDefaults, SelectableOptions } from "../entities/AppConfigurations";

export interface ConfigurationsRepository {
    getSelectableOptions(): FutureData<SelectableOptions>;
    getAppDefaults(): FutureData<AppDefaults>;
}
