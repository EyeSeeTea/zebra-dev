import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { OutbreakData } from "../entities/alert/OutbreakAlert";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Code, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    getEventByDisease(filter: OutbreakData): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEvent, haveChangedCasesData?: boolean): FutureData<Id>;
    complete(id: Id): FutureData<void>;
    getActiveByDisease(disease: Code): FutureData<Maybe<DiseaseOutbreakEventBaseAttrs>>;
}
