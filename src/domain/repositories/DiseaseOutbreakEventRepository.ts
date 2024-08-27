import { FutureData } from "../../data/api-futures";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    getConfigStrings(): FutureData<ConfigLabel[]>;
}
