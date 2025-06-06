import { D2Api, MetadataPick } from "../../types/d2-api";
import { OrgUnit, orgUnitLevelTypeByLevelNumber } from "../../domain/entities/OrgUnit";
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
                    filter: { level: { in: ["1", "2", "3"] } },
                },
            })
        ).map(response => {
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
        return d2OrgUnit
            .map(ou => {
                if (orgUnitLevelTypeByLevelNumber[ou.level]) {
                    return {
                        id: ou.id,
                        name: ou.name,
                        code: ou.code,
                        level: orgUnitLevelTypeByLevelNumber[ou.level],
                    };
                }
            })
            .filter((orgUnit): orgUnit is OrgUnit => orgUnit !== undefined);
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
