import { FutureData } from "../../data/api-futures";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEvent[]>;
    save(diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void>;
    delete(id: Id): FutureData<void>;
    getConfigStrings(): FutureData<ConfigLabel[]>;
}
