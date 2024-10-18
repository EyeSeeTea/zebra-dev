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

    deleteIncidentManagementTeamMemberRole(
        diseaseOutbreakId: Id,
        incidentManagementTeamRoleId: Id
    ): FutureData<void> {
        return apiToFuture(
            this.api.tracker.events.get({
                fields: {
                    dataValues: {
                        dataElement: { id: true, code: true },
                        value: true,
                    },
                    enrollment: true,
                    status: true,
                    occurredAt: true,
                },
                trackedEntity: diseaseOutbreakId,
                event: incidentManagementTeamRoleId,
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            })
        )
            .flatMap(response =>
                assertOrError(
                    response.instances[0],
                    `Incident management team builder event not found`
                )
            )
            .flatMap(d2Event => {
                const d2IncidentManagementTeamRoleToDelete: D2TrackerEvent = {
                    event: incidentManagementTeamRoleId,
                    status: d2Event.status,
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    programStage: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_PROGRAM_STAGE_ID,
                    enrollment: d2Event.enrollment,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    occurredAt: d2Event.occurredAt,
                    dataValues: d2Event.dataValues,
                    trackedEntity: diseaseOutbreakId,
                };

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "DELETE" },
                        { events: [d2IncidentManagementTeamRoleToDelete] }
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
        diseaseOutbreakId: Id
    ): FutureData<IncidentManagementTeamInAggregateRoot> {
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
                return Future.success(mapD2EventsToIncidentManagementTeamInAggregateRoot(d2Events));
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
