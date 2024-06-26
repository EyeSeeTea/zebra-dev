import { Id } from "@eyeseetea/d2-api";
import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreak } from "../entities/DiseaseOutbreak";

export interface DiseaseOutbreakRepository {
    get(id: Id): FutureData<DiseaseOutbreak>;
    getAll(): FutureData<DiseaseOutbreak[]>;
    save(diseaseOutbreak: DiseaseOutbreak): FutureData<void>;
    delete(id: Id): FutureData<void>;
}
