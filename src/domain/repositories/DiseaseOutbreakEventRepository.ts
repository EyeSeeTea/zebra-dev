import { FutureData } from "../../data/api-futures";
import { OutbreakData } from "../entities/alert/OutbreakAlert";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    getEventByDiseaseOrHazardType(
        filter: OutbreakData
    ): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEvent, haveChangedCasesData?: boolean): FutureData<Id>;
    complete(id: Id): FutureData<void>;
}
