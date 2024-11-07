import { D2Api, MetadataPick } from "../../types/d2-api";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../../domain/entities/Ref";
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
import { IncidentManagementTeam } from "../../domain/entities/incident-management-team/IncidentManagementTeam";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    mapD2EventsToIncidentManagementTeam,
    mapD2EventsToIncidentManagementTeamInAggregateRoot,
    mapIncidentManagementTeamMemberToD2Event,
} from "./utils/IncidentManagementTeamMapper";
import {
    DiseaseOutbreakEventAggregateRoot,
    IncidentManagementTeamInAggregateRoot,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { D2TrackerEnrollment } from "@eyeseetea/d2-api/api/trackerEnrollments";

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

    complete(id: Id): FutureData<void> {
        return apiToFuture(
            this.api.tracker.enrollments.get({
                fields: {
                    enrollment: true,
                    enrolledAt: true,
                    occurredAt: true,
                },
                trackedEntity: id,
                enrolledBefore: new Date().toISOString(),
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            })
        ).flatMap(enrollmentResponse => {
            const currentEnrollment = enrollmentResponse.instances[0];
            const currentEnrollmentId = currentEnrollment?.enrollment;
            if (!currentEnrollment || !currentEnrollmentId) {
                return Future.error(new Error(`Enrollment not found for Event Tracker`));
            }

            const enrollment: D2TrackerEnrollment = {
                ...currentEnrollment,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                program: RTSL_ZEBRA_PROGRAM_ID,
                trackedEntity: id,
                status: "COMPLETED",
            };

            return apiToFuture(
                this.api.tracker.post({ importStrategy: "UPDATE" }, { enrollments: [enrollment] })
            ).flatMap(response => {
                if (response.status !== "OK") {
                    return Future.error(
                        new Error(`Error completing disease outbreak event : ${response.message}`)
                    );
                } else return Future.success(undefined);
            });
        });
    }

    getIncidentManagementTeam(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[]
    ): FutureData<IncidentManagementTeam> {
        return getProgramStage(
            this.api,
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID
        )
            .flatMap(incidentManagementTeamBuilderResponse =>
                assertOrError(
                    incidentManagementTeamBuilderResponse.objects[0],
                    `Incident management team builder program stage not found`
                )
            )
            .flatMap(programStageDataElementsMetadata => {
                return apiToFuture(
                    this.api.tracker.events.get({
                        program: RTSL_ZEBRA_PROGRAM_ID,
                        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                        trackedEntity: diseaseOutbreakId,
                        programStage: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
                        fields: {
                            dataValues: {
                                dataElement: dataElementFields,
                                value: true,
                            },
                            trackedEntity: true,
                            event: true,
                        },
                    })
                )
                    .flatMap(response =>
                        assertOrError(response.instances, `Incident management team not found`)
                    )
                    .flatMap(d2Events => {
                        return Future.success(
                            mapD2EventsToIncidentManagementTeam(
                                diseaseOutbreakId,
                                d2Events,
                                teamMembers,
                                programStageDataElementsMetadata.programStageDataElements
                            )
                        );
                    });
            });
    }

    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id
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
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { events: [d2Event] }
                    )
                ).flatMap(saveResponse => {
                    if (saveResponse.status === "ERROR") {
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

    getAggregateRoot(id: Id): FutureData<DiseaseOutbreakEventAggregateRoot> {
        return this.get(id).flatMap(diseaseOutbreakEventBase => {
            return this.getIncidentManagementTeamInAggregateRoot(id).flatMap(
                incidentManagementTeam => {
                    //TO DO: create and get riskAssessment/incidentActionPlan entity with only the properties necessary to be able to get/save, the others to display are composed in the presentation layer
                    const diseaseOutbreakEvent: DiseaseOutbreakEventAggregateRoot =
                        new DiseaseOutbreakEventAggregateRoot({
                            ...diseaseOutbreakEventBase,
                            riskAssessment: undefined,
                            incidentActionPlan: undefined,
                            incidentManagementTeam: incidentManagementTeam,
                        });
                    return Future.success(diseaseOutbreakEvent);
                }
            );
        });
    }

    private getIncidentManagementTeamInAggregateRoot(
        diseaseOutbreakEventId: Id
    ): FutureData<IncidentManagementTeamInAggregateRoot> {
        return getProgramStage(
            this.api,
            RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID
        )
            .flatMap(incidentManagementTeamBuilderResponse =>
                assertOrError(
                    incidentManagementTeamBuilderResponse.objects[0],
                    `Incident management team builder program stage not found`
                )
            )
            .flatMap(programStageDataElementsMetadata => {
                return apiToFuture(
                    this.api.tracker.events.get({
                        program: RTSL_ZEBRA_PROGRAM_ID,
                        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                        trackedEntity: diseaseOutbreakEventId,
                        programStage: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
                        fields: {
                            dataValues: {
                                dataElement: dataElementFields,
                                value: true,
                            },
                            trackedEntity: true,
                            event: true,
                            updatedAt: true,
                        },
                    })
                )
                    .flatMap(response =>
                        assertOrError(response.instances, `Incident management team not found`)
                    )
                    .flatMap(d2Events => {
                        return Future.success(
                            mapD2EventsToIncidentManagementTeamInAggregateRoot(
                                d2Events,
                                programStageDataElementsMetadata.programStageDataElements
                            )
                        );
                    });
            });
    }

    //TO DO : Implement delete/archive after requirement confirmation
}

const dataElementFields = {
    id: true,
    code: true,
    name: true,
} as const;

export type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementFields };
}>["dataElements"][number];
