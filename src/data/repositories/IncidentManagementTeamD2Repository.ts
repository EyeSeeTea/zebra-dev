import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";

import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import {
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "./consts/DiseaseOutbreakConstants";
import { Maybe } from "../../utils/ts-utils";
import { IncidentManagementTeam } from "../../domain/entities/incident-management-team/IncidentManagementTeam";
import { IncidentManagementTeamRepository } from "../../domain/repositories/IncidentManagementTeamRepository";
import { Id } from "../../domain/entities/Ref";
import {
    mapD2EventsToIncidentManagementTeam,
    mapIncidentManagementTeamMemberToD2Event,
} from "./utils/IncidentManagementTeamMapper";
import { TeamMember, TeamRole } from "../../domain/entities/incident-management-team/TeamMember";
import { getProgramStage } from "./utils/MetadataHelper";
import { assertOrError } from "./utils/AssertOrError";
import { Role } from "../../domain/entities/incident-management-team/Role";

export class IncidentManagementTeamD2Repository implements IncidentManagementTeamRepository {
    constructor(private api: D2Api) {}

    get(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[],
        roles: Role[]
    ): FutureData<Maybe<IncidentManagementTeam>> {
        return this.getIncidentManagementTeamEvents(diseaseOutbreakId).flatMap(d2Events => {
            return Future.success(
                mapD2EventsToIncidentManagementTeam(d2Events, roles, teamMembers)
            );
        });
    }

    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id,
        roles: Role[]
    ): FutureData<void> {
        return this.saveIncidentManagementTeamMember({
            teamMemberRole,
            incidentManagementTeamMember,
            diseaseOutbreakId,
            roles,
        });
    }

    deleteIncidentManagementTeamMemberRoles(
        diseaseOutbreakId: Id,
        incidentManagementTeamRoleIds: Id[]
    ): FutureData<void> {
        const d2IncidentManagementTeamRolesToDelete: D2TrackerEvent[] =
            incidentManagementTeamRoleIds.map(id => ({
                event: id,
                status: "COMPLETED",
                program: RTSL_ZEBRA_PROGRAM_ID,
                programStage: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                occurredAt: "",
                dataValues: [],
                trackedEntity: diseaseOutbreakId,
            }));

        return apiToFuture(
            this.api.tracker.post(
                { importStrategy: "DELETE" },
                { events: d2IncidentManagementTeamRolesToDelete }
            )
        ).flatMap(deleteResponse => {
            if (deleteResponse.status === "ERROR") {
                return Future.error(
                    new Error(`Error deleting Incident Management Team Member Role`)
                );
            } else {
                return Future.success(undefined);
            }
        });
    }

    private getIncidentManagementTeamEvents(diseaseOutbreakId: Id): FutureData<D2TrackerEvent[]> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: diseaseOutbreakId,
                programStage: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
                fields: {
                    dataValues: {
                        dataElement: { id: true, code: true },
                        value: true,
                    },
                    trackedEntity: true,
                    event: true,
                    updatedAt: true,
                },
            })
        )
            .flatMap(response =>
                assertOrError(
                    response.instances,
                    `Incident management team builder program stage not found`
                )
            )
            .flatMap(d2Events => {
                return Future.success(d2Events);
            });
    }

    private saveIncidentManagementTeamMember(params: {
        teamMemberRole: TeamRole;
        incidentManagementTeamMember: TeamMember;
        diseaseOutbreakId: Id;
        roles: Role[];
    }): FutureData<void> {
        const { teamMemberRole, incidentManagementTeamMember, diseaseOutbreakId, roles } = params;
        return getProgramStage(
            this.api,
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID
        ).flatMap(incidentManagementTeamBuilderResponse => {
            const incidentManagementTeamBuilderDataElements =
                incidentManagementTeamBuilderResponse.objects[0]?.programStageDataElements;

            if (!incidentManagementTeamBuilderDataElements)
                return Future.error(
                    new Error(`Incident Management Team Builder Program Stage metadata not found`)
                );

            return apiToFuture(
                this.api.tracker.enrollments.get({
                    fields: {
                        enrollment: true,
                    },
                    trackedEntity: diseaseOutbreakId,
                    enrolledBefore: new Date().toISOString(),
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                })
            ).flatMap(enrollmentResponse => {
                const enrollmentId = enrollmentResponse.instances[0]?.enrollment;
                if (!enrollmentId) {
                    return Future.error(new Error(`Enrollment not found for Disease Outbreak`));
                }
                const d2Event: D2TrackerEvent = mapIncidentManagementTeamMemberToD2Event(
                    teamMemberRole,
                    incidentManagementTeamMember,
                    diseaseOutbreakId,
                    enrollmentId,
                    incidentManagementTeamBuilderDataElements,
                    roles
                );

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { events: [d2Event] }
                    )
                ).flatMap(saveResponse => {
                    if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                        return Future.error(
                            new Error(`Error with Incident Management Team Member`)
                        );
                    } else {
                        return Future.success(undefined);
                    }
                });
            });
        });
    }
}

const dataElementFields = {
    id: true,
    code: true,
    name: true,
} as const;

export type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementFields };
}>["dataElements"][number];
