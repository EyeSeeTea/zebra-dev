import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEvent } from "../entities/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";

export class GetDiseaseOutbreakEventUseCase {
    public execute(id: string): FutureData<DiseaseOutbreakEvent> {
        return Future.success({} as DiseaseOutbreakEvent);
    }
}
