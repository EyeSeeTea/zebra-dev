import { FutureData } from "../../data/api-futures";
import { MainSyndrome } from "../entities/disease-outbreak-event/MainSyndrome";

export interface MainSyndromeRepository {
    getAll(): FutureData<MainSyndrome[]>;
}
