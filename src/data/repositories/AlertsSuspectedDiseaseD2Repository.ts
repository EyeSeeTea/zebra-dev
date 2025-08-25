import { AlertsSuspectedDisease } from "../../domain/entities/AlertsSuspectedDisease";
import { AlertsSuspectedDiseaseRepository } from "../../domain/repositories/AlertsSuspectedDiseaseRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";

import { getOptionSet } from "./common/getOptionSet";
import { mapD2OptionSetToCodedNamedRef } from "./common/mapD2OptionSetToCodedNamedRef";

const OPTION_SET_ID = "eUqr3Qve3OS";
const OPTION_SET_NAME = "Diseases/Agents/Syndromes";

export class AlertsSuspectedDiseaseD2Repository implements AlertsSuspectedDiseaseRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<AlertsSuspectedDisease[]> {
        return getOptionSet(this.api, OPTION_SET_ID, OPTION_SET_NAME).map(optionSet =>
            mapD2OptionSetToCodedNamedRef(optionSet)
        );
    }
}
