import { FutureData } from "../../data/api-futures";
import { DistrictEventRepository } from "../repositories/DistrictEventRepository";
import _ from "../entities/generic/Collection";

export class MapNationalOutbreakToDistrictUseCase {
    constructor(private districtEventRepository: DistrictEventRepository) {}

    // _teiId: Id, _diseaseType: string, _hazardType, _eventType
    public execute(): FutureData<void> {
        const diseaseType = "Flu";
        const trackedEntityId = "SKI8VNFH4IC";

        return this.districtEventRepository.get().flatMap(events => {
            const districtLevelOutbreakEvents = _(events)
                .filter(event => event.suspectedDiseaseCode === diseaseType)
                .map(event => ({
                    ...event,
                    eventId: trackedEntityId,
                }))
                .value();

            return this.districtEventRepository.save(districtLevelOutbreakEvents);
        });
    }
}
