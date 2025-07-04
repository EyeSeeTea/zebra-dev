import { DataSource, dataSourceCodes } from "../../domain/entities/DataSource";
import { DataSourceRepository } from "../../domain/repositories/DataSourceRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { getOptionSet } from "./common/getOptionSet";
import { mapD2OptionSetToValidatedCodedNamedRef } from "./common/mapD2OptionSetToCodedNamedRef";

const OPTION_SET_ID = "oKE4qEqqB6Y";
const OPTION_SET_NAME = "Data Sources";
export class DataSourceD2Repository implements DataSourceRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<DataSource[]> {
        return getOptionSet(this.api, OPTION_SET_ID, OPTION_SET_NAME).map(optionSet =>
            mapD2OptionSetToValidatedCodedNamedRef(optionSet, dataSourceCodes)
        );
    }
}
