import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface DistrictEventRepository {
    get(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreaks: DiseaseOutbreakEventBaseAttrs[]): FutureData<void>;
}
