import { FutureData } from "../../data/api-futures";
import { OrgUnit } from "../entities/OrgUnit";
import { Id } from "../entities/Ref";

export interface OrgUnitRepository {
    get(ids: Id[]): FutureData<OrgUnit[]>;
    getAll(): FutureData<OrgUnit[]>;
}
