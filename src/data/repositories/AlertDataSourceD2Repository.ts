import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { getOptionSet } from "./common/getOptionSet";
import { AlertDataSource, AlertDataSourceCodes } from "../../domain/entities/alert/AlertDataSource";
import { AlertDataSourceRepository } from "../../domain/repositories/AlertDataSourceRepository";
import { mapD2OptionSetToNameCodeRefEntity } from "./common/mapD2OptionSetToNameCodeRefEntity";

const OPTION_SET_ID = "kSsd5PSQqH7";

export class AlertDataSourceD2Repository implements AlertDataSourceRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<AlertDataSource[]> {
        return getOptionSet(this.api, OPTION_SET_ID).map(optionSet =>
            mapD2OptionSetToNameCodeRefEntity(optionSet, AlertDataSourceCodes)
        );
    }
}
