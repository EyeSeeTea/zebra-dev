import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { FutureData } from "../api-futures";
import { DiseaseOutbreakEvent } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, ConfigLabel } from "../../domain/entities/Ref";
import { getTrackerEntityAttributes as getTrackedEntityAttributes } from "./utils/getTrackedEntityInstances";
import { DiseaseOutbreakEventOption } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventOptions";

const RTSL_ZEBRA_PROGRAM_ID = "qkOTdxkte8V";
const RTSL_ZEBRA_ORG_UNIT_ID = "PS5JpkoHHio";

export class DiseaseOutbreakEventD2Repository implements DiseaseOutbreakEventRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<DiseaseOutbreakEvent> {
        return getTrackedEntityAttributes(
            this.api,
            RTSL_ZEBRA_PROGRAM_ID,
            RTSL_ZEBRA_ORG_UNIT_ID,
            id
        );
    }
    getAll(): FutureData<DiseaseOutbreakEvent[]> {
        throw new Error("Method not implemented.");
    }
    save(_diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    delete(_id: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    getOptions(): FutureData<DiseaseOutbreakEventOption[]> {
        throw new Error("Method not implemented.");
    }
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }
}
