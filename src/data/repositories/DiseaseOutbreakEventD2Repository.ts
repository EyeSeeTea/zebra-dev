import { ConfigLabel } from "../../domain/entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { FutureData } from "../api-futures";

export class DiseaseOutbreakEventD2Repository implements DiseaseOutbreakEventRepository {
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }
    //TO DO : Implement delete/archive after requirement confirmation
}
