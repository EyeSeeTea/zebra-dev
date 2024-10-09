import { FutureData } from "../../data/api-futures";
import { OutbreakData } from "../entities/alert/AlertData";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    getEventByDiseaseOrHazardType(
        filter: OutbreakData
    ): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id>;
    getConfigStrings(): FutureData<ConfigLabel[]>;
}
