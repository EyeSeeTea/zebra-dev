import { Future } from "../../../domain/entities/generic/Future";
import { OrgUnit } from "../../../domain/entities/OrgUnit";
import { Id } from "../../../domain/entities/Ref";
import { OrgUnitRepository } from "../../../domain/repositories/OrgUnitRepository";
import { FutureData } from "../../api-futures";

export class OrgUnitTestRepository implements OrgUnitRepository {
    get(ids: Id[]): FutureData<OrgUnit[]> {
        const orgUnits: OrgUnit[] = ids.map(id => {
            return {
                id: id,
                name: `Org Unit Name ${id}`,
                code: `Org Unit Code ${id}`,
                level: id === "1" ? "Province" : "District",
            };
        });
        return Future.success(orgUnits);
    }

    getAll(): FutureData<OrgUnit[]> {
        const orgUnits: OrgUnit[] = ["1", "2"].map(id => {
            return {
                id: id,
                name: `Org Unit Name ${id}`,
                code: `Org Unit Code ${id}`,
                level: id === "1" ? "Province" : "District",
            };
        });
        return Future.success(orgUnits);
    }
}
