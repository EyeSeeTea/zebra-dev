import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { getOptionSet } from "./common/getOptionSet";
import { AlertDataSource, alertDataSourceCodes } from "../../domain/entities/alert/AlertDataSource";
import { AlertDataSourceRepository } from "../../domain/repositories/AlertDataSourceRepository";
import { mapD2OptionSetToValidatedCodedNamedRef } from "./common/mapD2OptionSetToCodedNamedRef";

const OPTION_SET_ID = "kSsd5PSQqH7";
const OPTION_SET_NAME = "Alert Data Sources";
export class AlertDataSourceD2Repository implements AlertDataSourceRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<AlertDataSource[]> {
        return getOptionSet(this.api, OPTION_SET_ID, OPTION_SET_NAME).map(optionSet =>
            mapD2OptionSetToValidatedCodedNamedRef(optionSet, alertDataSourceCodes)
        );
    }
}
