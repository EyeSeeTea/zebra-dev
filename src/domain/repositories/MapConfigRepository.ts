import { FutureData } from "../../data/api-futures";
import { MapConfig, MapKey } from "../entities/MapConfig";

export interface MapConfigRepository {
    get(mapKey: MapKey): FutureData<MapConfig>;
}
