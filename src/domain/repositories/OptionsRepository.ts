import { FutureData } from "../../data/api-futures";
import { Id, NamedRef } from "../entities/Ref";

export interface OptionsRepository {
    get(id: Id): FutureData<NamedRef>;
}
