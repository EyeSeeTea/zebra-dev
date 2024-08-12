import { D2OrganisationUnitSchema, SelectedPick } from "@eyeseetea/d2-api/2.36";
import { D2Api } from "../../types/d2-api";
import { OrgUnit } from "../../domain/entities/OrgUnit";
import { Id } from "../../domain/entities/Ref";
import { OrgUnitRepository } from "../../domain/repositories/OrgUnitRepository";
import { apiToFuture, FutureData } from "../api-futures";

type D2OrgUnit = SelectedPick<
    D2OrganisationUnitSchema,
    {
        id: true;
        name: true;
        code: true;
        level: true;
    }
>;

export class OrgUnitD2Repository implements OrgUnitRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<OrgUnit[]> {
        return apiToFuture(
            this.api.metadata.get({
                organisationUnits: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        level: true,
                    },
                },
            })
        ).map(response => {
            const d2OrgUnitsProvinceOrDistrict = response.organisationUnits.filter(
                ou => ou.level === 2 || ou.level === 3
            );
            return this.mapD2OrgUnitsToOrgUnits(d2OrgUnitsProvinceOrDistrict);
        });
    }

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

    private mapD2OrgUnitsToOrgUnits(d2OrgUnit: D2OrgUnit[]): OrgUnit[] {
        return d2OrgUnit.map(ou => {
            return {
                id: ou.id,
                name: ou.name,
                code: ou.code,
                level: ou.level === 2 ? "Province" : "District",
            };
        });
    }
}
