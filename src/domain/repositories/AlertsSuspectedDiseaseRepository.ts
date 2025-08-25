import { FutureData } from "../../data/api-futures";
import { AlertsSuspectedDisease } from "../entities/AlertsSuspectedDisease";

export interface AlertsSuspectedDiseaseRepository {
    getAll(): FutureData<AlertsSuspectedDisease[]>;
}
