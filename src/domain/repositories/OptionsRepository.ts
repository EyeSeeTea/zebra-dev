import { FutureData } from "../../data/api-futures";
import { Id, Option } from "../entities/Ref";

export interface OptionsRepository {
    get(id: Id): FutureData<Option>;
}
