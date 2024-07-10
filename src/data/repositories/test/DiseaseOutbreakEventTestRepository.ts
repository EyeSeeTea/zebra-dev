import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventOption } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventOptions";
import { Id, ConfigLabel } from "../../../domain/entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../domain/repositories/DiseaseOutbreakEventRepository";
import { FutureData } from "../../api-futures";

export class DiseaseOutbreakEventTestRepository implements DiseaseOutbreakEventRepository {
    get(_id: Id): FutureData<DiseaseOutbreakEvent> {
        throw new Error("Method not implemented.");
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
