import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { assertOrError } from "./utils/AssertOrError";
import { Future } from "../../domain/entities/generic/Future";
import { Role } from "../../domain/entities/incident-management-team/Role";
import { RoleRepository } from "../../domain/repositories/RoleRepository";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS } from "./consts/IncidentManagementTeamBuilderConstants";

export class RoleD2Repository implements RoleRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<Role[]> {
        return apiToFuture(
            this.api.models.dataElements.get({
                fields: dataElementFields,
                paging: false,
                filter: {
                    id: { in: Object.values(RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS) },
                },
            })
        )
            .flatMap(response => assertOrError(response.objects, `Roles not found`))
            .flatMap(d2DataElementRoles => {
                if (d2DataElementRoles.length === 0)
                    return Future.error(new Error(`Roles not found`));
                else
                    return Future.success(
                        d2DataElementRoles.map(d2DataElementRole =>
                            this.mapDataElementToRole(d2DataElementRole)
                        )
                    );
            });
    }

    private mapDataElementToRole(d2DataElementRole: D2DataElement): Role {
        return {
            id: d2DataElementRole.id,
            code: d2DataElementRole.code,
            name: d2DataElementRole.name,
        };
    }
}

const dataElementFields = {
    id: true,
    code: true,
    name: true,
} as const;

type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementFields };
}>["dataElements"][number];
