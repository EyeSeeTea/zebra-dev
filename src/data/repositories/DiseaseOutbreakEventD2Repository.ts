import { D2Api, MetadataPick } from "../../types/d2-api";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, ConfigLabel } from "../../domain/entities/Ref";
import {
    mapDiseaseOutbreakEventToTrackedEntityAttributes,
    mapTrackedEntityAttributesToDiseaseOutbreak,
} from "./utils/DiseaseOutbreakMapper";
import {
    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "./consts/DiseaseOutbreakConstants";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { getProgramStage, getProgramTEAsMetadata } from "./utils/MetadataHelper";
import { assertOrError } from "./utils/AssertOrError";
import { Future } from "../../domain/entities/generic/Future";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import { TeamMember, TeamRole } from "../../domain/entities/incident-management-team/TeamMember";
import { Role } from "../../domain/entities/incident-management-team/Role";
import { IncidentManagementTeam } from "../../domain/entities/incident-management-team/IncidentManagementTeam";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    getTeamMemberIncidentManagementTeamRoles,
    mapD2EventsToIncidentManagementTeam,
    mapIncidentManagementTeamMemberToD2Event,
} from "./utils/IncidentManagementTeamMapper";

export class DiseaseOutbreakEventD2Repository implements DiseaseOutbreakEventRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: id,
                fields: { attributes: true, trackedEntity: true, updatedAt: true },
            })
        )
            .flatMap(response => assertOrError(response.instances[0], "Tracked entity"))
            .map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
    }

    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, RTSL_ZEBRA_PROGRAM_ID, RTSL_ZEBRA_ORG_UNIT_ID)
        ).map(trackedEntities => {
            return trackedEntities
                .map(trackedEntity => {
                    return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
                })
                .filter(outbreak => outbreak.status === "ACTIVE");
        });
    }

    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id> {
        return getProgramTEAsMetadata(this.api, RTSL_ZEBRA_PROGRAM_ID).flatMap(
            teasMetadataResponse => {
                const teasMetadata =
                    teasMetadataResponse.objects[0]?.programTrackedEntityAttributes;

                if (!teasMetadata)
                    return Future.error(
                        new Error(`Program Tracked Entity Attributes metadata not found`)
                    );

                const trackedEntity: D2TrackerTrackedEntity =
                    mapDiseaseOutbreakEventToTrackedEntityAttributes(diseaseOutbreak, teasMetadata);

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { trackedEntities: [trackedEntity] }
                    )
                ).flatMap(saveResponse => {
                    const diseaseOutbreakId =
                        saveResponse.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports[0]
                            ?.uid;

                    if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                        return Future.error(
                            new Error(
                                `Error saving disease outbreak event: ${saveResponse.validationReport.errorReports
                                    .map(e => e.message)
                                    .join(", ")}`
                            )
                        );
                    } else {
                        return Future.success(diseaseOutbreakId);
                    }
                });
            }
        );
    }

    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }

    getIncidentManagementTeam(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[],
        roles: Role[]
    ): FutureData<IncidentManagementTeam> {
        return this.getIncidentManagementTeamEvents(diseaseOutbreakId).flatMap(d2Events => {
            return Future.success(
                mapD2EventsToIncidentManagementTeam(d2Events, roles, teamMembers)
            );
        });
    }

    getIncidentManagementTeamMember(
        username: Id,
        diseaseOutbreakId: Id,
        roles: Role[]
    ): FutureData<TeamMember> {
        return this.getIncidentManagementTeamEvents(diseaseOutbreakId).flatMap(d2Events => {
            return apiToFuture(
                this.api.metadata.get({
                    users: {
                        fields: d2UserFields,
                        filter: { username: { eq: username } },
                    },
                })
            )
                .flatMap(response =>
                    assertOrError(response.users[0], "Incident Management Team Member")
                )
                .map(d2User =>
                    this.mapUserToIncidentManagementTeamMember(d2User as D2UserFix, d2Events, roles)
                );
        });
    }

    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id,
        roles: Role[]
    ): FutureData<void> {
        return this.saveOrDeleteIncidentManagementTeamMember({
            teamMemberRole,
            incidentManagementTeamMember,
            diseaseOutbreakId,
            importStrategy: "CREATE_AND_UPDATE",
            roles,
        });
    }

    deleteIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id,
        roles: Role[]
    ): FutureData<void> {
        return this.saveOrDeleteIncidentManagementTeamMember({
            teamMemberRole,
            incidentManagementTeamMember,
            diseaseOutbreakId,
            importStrategy: "DELETE",
            roles,
        });
    }

    private mapUserToIncidentManagementTeamMember(
        d2User: D2UserFix,
        events: D2TrackerEvent[],
        roles: Role[]
    ): TeamMember {
        const avatarId = d2User?.avatar?.id;
        const photoUrlString = avatarId
            ? `${this.api.baseUrl}/api/fileResources/${avatarId}/data`
            : undefined;

        const teamMember = new TeamMember({
            id: d2User.id,
            username: d2User.username,
            name: d2User.name,
            email: d2User.email,
            phone: d2User.phoneNumber,
            status: "Available", // TODO: Get status when defined
            photo:
                photoUrlString && TeamMember.isValidPhotoUrl(photoUrlString)
                    ? new URL(photoUrlString)
                    : undefined,
            teamRoles: undefined,
            workPosition: undefined, // TODO: Get workPosition when defined
        });

        const teamRoles = getTeamMemberIncidentManagementTeamRoles(teamMember, events, roles);

        return new TeamMember({
            ...teamMember,
            teamRoles: teamRoles.length > 0 ? teamRoles : undefined,
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

    private saveOrDeleteIncidentManagementTeamMember(params: {
        teamMemberRole: TeamRole;
        incidentManagementTeamMember: TeamMember;
        diseaseOutbreakId: Id;
        importStrategy: "CREATE_AND_UPDATE" | "DELETE";
        roles: Role[];
    }): FutureData<void> {
        const {
            teamMemberRole,
            incidentManagementTeamMember,
            diseaseOutbreakId,
            importStrategy,
            roles,
        } = params;
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
                    this.api.tracker.post({ importStrategy: importStrategy }, { events: [d2Event] })
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

    //TO DO : Implement delete/archive after requirement confirmation
}

const d2UserFields = {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    username: true,
    avatar: true,
} as const;

type D2User = MetadataPick<{
    users: { fields: typeof d2UserFields };
}>["users"][number];

type D2UserFix = D2User & { username: string };

const dataElementFields = {
    id: true,
    code: true,
    name: true,
} as const;

export type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementFields };
}>["dataElements"][number];
