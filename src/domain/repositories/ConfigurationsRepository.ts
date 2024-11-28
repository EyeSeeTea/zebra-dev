import { FutureData } from "../../data/api-futures";
import { SelectableOptions } from "../entities/AppConfigurations";

export interface ConfigurationsRepository {
    getSelectableOptions(): FutureData<SelectableOptions>;
}
