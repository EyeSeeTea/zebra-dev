import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEvent>;
    getAll(): FutureData<DiseaseOutbreakEvent[]>;
    save(diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void>;
    delete(id: Id): FutureData<void>;
    // getOptions(): FutureData<DiseaseOutbreakEventOption[]>;
    getConfigStrings(): FutureData<ConfigLabel[]>;
}
