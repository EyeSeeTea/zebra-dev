import { D2Api, MetadataPick } from "../../types/d2-api";
import { OrgUnit } from "../../domain/entities/OrgUnit";
import { Id } from "../../domain/entities/Ref";
import { OrgUnitRepository } from "../../domain/repositories/OrgUnitRepository";
import { apiToFuture, FutureData } from "../api-futures";

export class OrgUnitD2Repository implements OrgUnitRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<OrgUnit[]> {
        return apiToFuture(
            this.api.metadata.get({
                organisationUnits: {
                    fields: d2OrgUnitFields,
                    filter: { level: { in: ["2", "3"] } },
                },
            })
        ).map(response => {
            // const d2OrgUnitsProvinceOrDistrict = response.organisationUnits.filter(
            //     ou => ou.level === 2 || ou.level === 3
            // );
            return this.mapD2OrgUnitsToOrgUnits(response.organisationUnits);
        });
    }

    get(ids: Id[]): FutureData<OrgUnit[]> {
        return apiToFuture(
            this.api.metadata.get({
                organisationUnits: {
                    fields: d2OrgUnitFields,
                    filter: { id: { in: ids } },
                },
            })
        ).map(response => {
            return this.mapD2OrgUnitsToOrgUnits(response.organisationUnits);
        });
    }

    getByLevel(level: number): FutureData<OrgUnit[]> {
        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: d2OrgUnitFields,
                paging: false,
                level: level,
            })
        ).map(response => {
            return this.mapD2OrgUnitsToOrgUnits(response.objects);
        });
    }

    private mapD2OrgUnitsToOrgUnits(d2OrgUnit: D2OrgUnit[]): OrgUnit[] {
        return d2OrgUnit.map(
            (ou): OrgUnit => ({
                id: ou.id,
                name: ou.name,
                code: ou.code,
                level: ou.level === 2 ? "Province" : "District",
            })
        );
    }
}

const d2OrgUnitFields = {
    id: true,
    name: true,
    code: true,
    level: true,
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof d2OrgUnitFields };
}>["organisationUnits"][number];
