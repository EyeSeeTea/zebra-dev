import { D2Api } from "@eyeseetea/d2-api/2.36";
import { DiseaseOutbreakRepository } from "../../domain/repositories/DiseaseOutbreakRepository";
import { DiseaseOutbreak } from "../../domain/entities/DiseaseOutbreak";
import { FutureData } from "../api-futures";

export class DiseaseOutbreakD2Repository implements DiseaseOutbreakRepository {
    constructor(private api: D2Api) {}

    get(id: string): FutureData<DiseaseOutbreak> {
        throw new Error("Method not implemented.");
    }
    getAll(): FutureData<DiseaseOutbreak[]> {
        throw new Error("Method not implemented.");
    }
    save(diseaseOutbreak: DiseaseOutbreak): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
