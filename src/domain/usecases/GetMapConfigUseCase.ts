import { FutureData } from "../../data/api-futures";
import { MapConfig, MapKey } from "../entities/MapConfig";
import { MapConfigRepository } from "../repositories/MapConfigRepository";

export class GetMapConfigUseCase {
    constructor(private mapConfigRepository: MapConfigRepository) {}

    public execute(mapKey: MapKey): FutureData<MapConfig> {
        return this.mapConfigRepository.get(mapKey);
    }
}
