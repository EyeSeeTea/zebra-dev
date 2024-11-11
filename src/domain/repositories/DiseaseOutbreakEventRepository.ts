import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id>;
    complete(id: Id): FutureData<void>;
}
