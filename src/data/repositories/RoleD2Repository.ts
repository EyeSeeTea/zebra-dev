import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { assertOrError } from "./utils/AssertOrError";
import { Future } from "../../domain/entities/generic/Future";
import { Role } from "../../domain/entities/Role";
import { RoleRepository } from "../../domain/repositories/RoleRepository";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID } from "./consts/DiseaseOutbreakConstants";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES } from "./consts/IncidentManagementTeamBuilderConstants";

export class RoleD2Repository implements RoleRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<Role[]> {
        return apiToFuture(
            this.api.models.programStages.get({
                fields: programStageFields,
                filter: {
                    id: {
                        eq: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
                    },
                },
            })
        )
            .flatMap(response =>
                assertOrError(
                    response.objects,
                    `Incident management team builder program stage not found`
                )
            )
            .flatMap(d2ProgramStages => {
                const programStageDataElementsIds =
                    d2ProgramStages[0]?.programStageDataElements.map(
                        ({ dataElement }) => dataElement.id
                    );
                if (!programStageDataElementsIds?.length) {
                    return Future.error(
                        new Error(
                            `Incident management team builder program stage data elements not found`
                        )
                    );
                } else {
                    const programStageDataElementsRoleIds = programStageDataElementsIds?.filter(
                        id =>
                            id !==
                                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.teamMemberAssigned &&
                            id !==
                                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_IDS_WITHOUT_ROLES.reportsToUsername
                    );

                    return apiToFuture(
                        this.api.models.dataElements.get({
                            fields: dataElementFields,
                            paging: false,
                            filter: {
                                id: {
                                    in: programStageDataElementsRoleIds,
                                },
                            },
                        })
                    )
                        .flatMap(response =>
                            assertOrError(
                                response.objects,
                                `Incident management team builder data elements not found`
                            )
                        )
                        .flatMap(d2DataElements => {
                            return Future.success(
                                this.mapProgramStageDataElementsToRoles(d2DataElements)
                            );
                        });
                }
            });
    }

    private mapProgramStageDataElementsToRoles(d2DataElements: D2DataElement[]): Role[] {
        return d2DataElements.map(dataElement => ({
            id: dataElement.id,
            name: dataElement.name,
            code: dataElement.code,
        }));
    }
}

const programStageFields = {
    programStageDataElements: {
        dataElement: { id: true },
    },
} as const;

const dataElementFields = {
    id: true,
    code: true,
    name: true,
} as const;

export type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementFields };
}>["dataElements"][number];
