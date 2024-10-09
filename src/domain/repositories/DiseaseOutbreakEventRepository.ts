import { FutureData } from "../../data/api-futures";
import { AttributeFilter } from "../../data/repositories/AlertD2Repository";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    getEventByDiseaseOrHazardType(
        filter: AttributeFilter
    ): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id>;
    getConfigStrings(): FutureData<ConfigLabel[]>;
}
