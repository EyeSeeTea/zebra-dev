import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { getOptionSet } from "./common/getOptionSet";
import { mapD2OptionSetToCodedNamedRef } from "./common/mapD2OptionSetToCodedNamedRef";
import { NotificationSource } from "../../domain/entities/disease-outbreak-event/NotificationSources";
import { NotificationSourcesRepository } from "../../domain/repositories/NotificationSourcesRepository";

const OPTION_SET_ID = "sWJfduaSmm8";
const OPTION_SET_NAME = "Notification Source";
export class NotificationSourcesD2Repository implements NotificationSourcesRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<NotificationSource[]> {
        return getOptionSet(this.api, OPTION_SET_ID, OPTION_SET_NAME).map(optionSet =>
            mapD2OptionSetToCodedNamedRef(optionSet)
        );
    }
}
