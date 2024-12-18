import { FutureData } from "../../data/api-futures";
import { CasesDataSource } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { MapConfig, MapKey } from "../entities/MapConfig";
import { MapConfigRepository } from "../repositories/MapConfigRepository";

export class GetMapConfigUseCase {
    constructor(private mapConfigRepository: MapConfigRepository) {}

    public execute(mapKey: MapKey, casesDataSource?: CasesDataSource): FutureData<MapConfig> {
        return this.mapConfigRepository.get(mapKey, casesDataSource);
    }
}
