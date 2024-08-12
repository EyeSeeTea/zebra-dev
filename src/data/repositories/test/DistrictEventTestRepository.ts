import { DistrictEvent } from "../../../domain/entities/disease-outbreak-event/DistrictEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { DistrictEventRepository } from "../../../domain/repositories/DistrictEventRepository";
import { FutureData } from "../../api-futures";

export class DistrictEventTestRepository implements DistrictEventRepository {
    get(): FutureData<DistrictEvent[]> {
        return Future.success([
            {
                id: "id",
                eventId: "SKI8VNFH4IC",
                name: "Disease Outbreak 1",
                hazardType: "Biological:Animal",
                suspectedDiseaseId: "1",
            },
        ]);
    }

    save(_diseaseOutbreaks: DistrictEvent[]): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
