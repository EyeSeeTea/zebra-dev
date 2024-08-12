import { FutureData } from "../../data/api-futures";
import { DistrictEvent } from "../entities/disease-outbreak-event/DistrictEvent";

export interface DistrictEventRepository {
    get(): FutureData<DistrictEvent[]>;
    save(diseaseOutbreaks: DistrictEvent[]): FutureData<void>;
}
