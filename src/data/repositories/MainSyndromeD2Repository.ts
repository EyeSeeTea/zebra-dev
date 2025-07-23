import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { getOptionSet } from "./common/getOptionSet";
import { mapD2OptionSetToCodedNamedRef } from "./common/mapD2OptionSetToCodedNamedRef";
import { MainSyndrome } from "../../domain/entities/disease-outbreak-event/MainSyndrome";
import { MainSyndromeRepository } from "../../domain/repositories/MainSyndromeRepository";

const OPTION_SET_ID = "q0iXscTqP1D";
const OPTION_SET_NAME = "Main Syndromes";
export class MainSyndromeD2Repository implements MainSyndromeRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<MainSyndrome[]> {
        return getOptionSet(this.api, OPTION_SET_ID, OPTION_SET_NAME).map(optionSet =>
            mapD2OptionSetToCodedNamedRef(optionSet)
        );
    }
}
