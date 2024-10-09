import { FutureData } from "../../data/api-futures";
import { AlertData } from "../entities/alert/AlertData";

export interface AlertDataRepository {
    get(): FutureData<AlertData[]>;
}
