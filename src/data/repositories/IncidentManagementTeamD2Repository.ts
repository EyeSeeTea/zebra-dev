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
    getTeamMemberIncidentManagementTeamRoles,
    mapD2EventsToIncidentManagementTeam,
    mapIncidentManagementTeamMemberToD2Event,
} from "./utils/IncidentManagementTeamMapper";
import { TeamMember, TeamRole } from "../../domain/entities/incident-management-team/TeamMember";
import { getProgramStage } from "./utils/MetadataHelper";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS } from "./consts/IncidentManagementTeamBuilderConstants";
import { assertOrError } from "./utils/AssertOrError";

export class IncidentManagementTeamD2Repository implements IncidentManagementTeamRepository {
    constructor(private api: D2Api) {}

    get(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[]
    ): FutureData<Maybe<IncidentManagementTeam>> {
        return this.getDataElementRolesAndIncidentManagementTeamEvents(diseaseOutbreakId).flatMap(
            ({ dataElementRoles, events }) => {
                const maybeIncidentManagementTeam: Maybe<IncidentManagementTeam> =
                    mapD2EventsToIncidentManagementTeam(events, dataElementRoles, teamMembers);
                return Future.success(maybeIncidentManagementTeam);
            }
        );
    }

    getIncidentManagementTeamMember(username: Id, diseaseOutbreakId: Id): FutureData<TeamMember> {
        return this.getDataElementRolesAndIncidentManagementTeamEvents(diseaseOutbreakId).flatMap(
            ({ dataElementRoles, events }) => {
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
                        this.mapUserToIncidentManagementTeamMember(
                            d2User as D2UserFix,
                            events,
                            dataElementRoles
                        )
                    );
            }
        );
    }

    private mapUserToIncidentManagementTeamMember(
        d2User: D2UserFix,
        events: D2TrackerEvent[],
        dataElementRoles: D2DataElement[]
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

        const teamRoles = getTeamMemberIncidentManagementTeamRoles(
            teamMember,
            events,
            dataElementRoles
        );

        return new TeamMember({
            ...teamMember,
            teamRoles: teamRoles.length > 0 ? teamRoles : undefined,
        });
    }

    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        return this.saveOrDeleteIncidentManagementTeamMember(
            teamMemberRole,
            incidentManagementTeamMember,
            diseaseOutbreakId,
            "CREATE_AND_UPDATE"
        );
    }

    deleteIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        return this.saveOrDeleteIncidentManagementTeamMember(
            teamMemberRole,
            incidentManagementTeamMember,
            diseaseOutbreakId,
            "DELETE"
        );
    }

    private getDataElementRolesAndIncidentManagementTeamEvents(diseaseOutbreakId: Id): FutureData<{
        dataElementRoles: D2DataElement[];
        events: D2TrackerEvent[];
    }> {
        return Future.joinObj(
            {
                dataElementRoles: apiToFuture(
                    this.api.models.dataElements.get({
                        fields: dataElementFields,
                        paging: false,
                        filter: {
                            id: {
                                in: Object.values(
                                    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS
                                ),
                            },
                        },
                    })
                ),
                events: apiToFuture(
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
                ),
            },
            { concurrency: 2 }
        ).flatMap(({ dataElementRoles, events }) => {
            return Future.success({
                dataElementRoles: dataElementRoles.objects,
                events: events.instances,
            });
        });
    }

    private saveOrDeleteIncidentManagementTeamMember(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id,
        importStrategy: "CREATE_AND_UPDATE" | "DELETE"
    ): FutureData<void> {
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
                    incidentManagementTeamBuilderDataElements
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
