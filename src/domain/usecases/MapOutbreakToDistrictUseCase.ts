import { FutureData } from "../../data/api-futures";
import { DistrictEventRepository } from "../repositories/DistrictEventRepository";

const diseaseType = "Flu";
const trackedEntityId = "SKI8VNFH4IC";

export class MapOutbreakToDistrictUseCase {
    constructor(private diseaseOutbreakRepository: DistrictEventRepository) {}

    // _teiId: Id, _diseaseType: string, _hazardType, _eventType
    public execute(): FutureData<void> {
        return this.diseaseOutbreakRepository.get().flatMap(events => {
            const filteredDiseaseOutbreakEvents = events.filter(
                diseaseOutbreakEvent => diseaseOutbreakEvent.suspectedDiseaseId === diseaseType
            );

            const districtLevelOutbreakEvents = filteredDiseaseOutbreakEvents.map(
                diseaseOutbreakEvent => ({
                    ...diseaseOutbreakEvent,
                    eventId: trackedEntityId,
                })
            );

            return this.diseaseOutbreakRepository.save(districtLevelOutbreakEvents);
        });
    }
}
