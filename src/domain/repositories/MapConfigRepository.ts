import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { MapConfig, MapKey } from "../entities/MapConfig";

export interface MapConfigRepository {
    get(mapKey: MapKey, casesDataSource?: CasesDataSource): FutureData<MapConfig>;
}
