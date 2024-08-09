import { D2Api } from "../../types/d2-api";
import { OrgUnit } from "../../domain/entities/OrgUnit";
import { Id } from "../../domain/entities/Ref";
import { OrgUnitRepository } from "../../domain/repositories/OrgUnitRepository";
import { apiToFuture, FutureData } from "../api-futures";

export class OrgUnitD2Repository implements OrgUnitRepository {
    constructor(private api: D2Api) {}
    get(ids: Id[]): FutureData<OrgUnit[]> {
        return apiToFuture(
            this.api.metadata.get({
                organisationUnits: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        level: true,
                    },
                    filter: { id: { in: ids } },
                },
            })
        ).map(response => {
            const orgUnits: OrgUnit[] = response.organisationUnits.map((ou): OrgUnit => {
                return {
                    id: ou.id,
                    name: ou.name,
                    code: ou.code,
                    level: ou.level === 2 ? "Province" : "District",
                };
            });

            return orgUnits;
        });
    }
}
