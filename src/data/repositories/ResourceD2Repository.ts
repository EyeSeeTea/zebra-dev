import { D2Api } from "../../types/d2-api";
import { ResourceRepository } from "../../domain/repositories/ResourceRepository";
import { Resource, isDiseaseOutbreakEventDocument } from "../../domain/entities/resources/Resource";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { Id } from "../../domain/entities/Ref";
import { D2TrackerEvent, TrackerEventsResponse } from "@eyeseetea/d2-api/api/trackerEvents";
import { getProgramStage } from "./utils/MetadataHelper";
import {
    eventFields,
    RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_DATA_ELEMENT_ID,
    RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_RESOURCE_ID_DATA_ELEMENT_ID,
    RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_ID,
    RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RESOURCES_ORG_UNIT_ID,
} from "./consts/ResourceConstants";
import { mapD2TrackerEventToResource, mapResourceToD2TrackerEvent } from "./utils/ResourceMapper";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import { assertOrError } from "./utils/AssertOrError";
import { TrackerPostResponse } from "@eyeseetea/d2-api/api/tracker";

export class ResourceD2Repository implements ResourceRepository {
    constructor(private api: D2Api) {}

    getAll(options?: { ids?: Id[]; diseaseOutbreakId?: Id }): FutureData<Resource[]> {
        return Future.fromPromise(this.getAllD2TrackerEventResourcesAsync(options)).flatMap(
            (d2Events: D2TrackerEvent[]) => {
                return Future.success(
                    d2Events.map(d2Event => mapD2TrackerEventToResource(d2Event))
                );
            }
        );
    }

    save(resource: Resource): FutureData<void> {
        return Future.joinObj({
            resourcesProgramStage: getProgramStage(
                this.api,
                RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_STAGE_ID
            ),
            diseaseOutbreakResourcesProgramStage: isDiseaseOutbreakEventDocument(resource)
                ? getProgramStage(this.api, RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_PROGRAM_STAGE_ID)
                : Future.success(undefined),
        }).flatMap(({ resourcesProgramStage, diseaseOutbreakResourcesProgramStage }) => {
            const resourcesDataElements =
                resourcesProgramStage.objects[0]?.programStageDataElements;

            const diseaseOutbreakResourcesDataElements = isDiseaseOutbreakEventDocument(resource)
                ? diseaseOutbreakResourcesProgramStage?.objects[0]?.programStageDataElements
                : undefined;

            if (
                !resourcesDataElements ||
                (isDiseaseOutbreakEventDocument(resource) && !diseaseOutbreakResourcesDataElements)
            )
                return Future.error(new Error(`Resources data elements not found`));

            const resourceEventToCreate: D2TrackerEvent = mapResourceToD2TrackerEvent(
                resource,
                resourcesDataElements
            );

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "CREATE" },
                    { events: [resourceEventToCreate] }
                )
            ).flatMap((response: TrackerPostResponse) => {
                if (response.status !== "OK") {
                    return Future.error(new Error(`Error saving resource: ${response.message}`));
                } else {
                    const createdEventId =
                        response.bundleReport.typeReportMap.EVENT.objectReports[0]?.uid;
                    if (isDiseaseOutbreakEventDocument(resource) && createdEventId) {
                        return this.saveResourceIdInDiseaseOutbreakEvent(
                            resource.diseaseOutbreakEventId,
                            createdEventId
                        );
                    } else {
                        return Future.success(undefined);
                    }
                }
            });
        });
    }

    deleteById(id: Id): FutureData<void> {
        return apiToFuture(
            this.api.tracker.events.getById(id, {
                fields: eventFields,
            })
        ).flatMap((eventToDelete: D2TrackerEvent) => {
            return apiToFuture(
                this.api.tracker.post({ importStrategy: "DELETE" }, { events: [eventToDelete] })
            ).flatMap(response => {
                if (response.status !== "OK") {
                    return Future.error(new Error(`Error deleting resource: ${response.message}`));
                }

                const resourceDeleted = mapD2TrackerEventToResource(eventToDelete);

                if (
                    isDiseaseOutbreakEventDocument(resourceDeleted) &&
                    resourceDeleted.diseaseOutbreakEventId
                ) {
                    return this.deleteResourceIdInDiseaseOutbreakEvent(
                        resourceDeleted.diseaseOutbreakEventId,
                        resourceDeleted.id
                    );
                } else {
                    return Future.success(undefined);
                }
            });
        });
    }

    private saveResourceIdInDiseaseOutbreakEvent(
        diseaseOutbreakEventId: Id,
        resourceId: Id
    ): FutureData<void> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: diseaseOutbreakEventId,
                fields: { enrollments: true },
                ouMode: "SELECTED",
            })
        )
            .flatMap(response =>
                assertOrError(response.instances[0], "Disease outbreak event not found")
            )
            .flatMap(trackedEntityDiseaseOutbreak => {
                const enrollments = trackedEntityDiseaseOutbreak?.enrollments;

                if (!enrollments) {
                    return Future.error(
                        new Error("No enrollments found for disease outbreak event")
                    );
                }

                const eventInDiseaseOutbreakToCreate: D2TrackerEvent = {
                    event: "",
                    trackedEntity: diseaseOutbreakEventId,
                    enrollment: enrollments[0]?.enrollment,
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    programStage: RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_PROGRAM_STAGE_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    dataValues: [
                        {
                            dataElement:
                                RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_RESOURCE_ID_DATA_ELEMENT_ID,
                            value: resourceId,
                        },
                    ],
                    occurredAt: new Date().toISOString(),
                    status: "ACTIVE",
                };

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE" },
                        { events: [eventInDiseaseOutbreakToCreate] }
                    )
                ).flatMap(response => {
                    if (response.status !== "OK") {
                        return Future.error(
                            new Error(`Error saving resource: ${response.message}`)
                        );
                    } else {
                        return Future.success(undefined);
                    }
                });
            });
    }

    private deleteResourceIdInDiseaseOutbreakEvent(
        diseaseOutbreakEventId: Id,
        resourceId: Id
    ): FutureData<void> {
        return apiToFuture(
            this.api.tracker.events.get({
                trackedEntity: diseaseOutbreakEventId,
                program: RTSL_ZEBRA_PROGRAM_ID,
                programStage: RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_PROGRAM_STAGE_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                ouMode: "SELECTED",
                fields: { ...eventFields, trackedEntity: true },
                programStatus: "ACTIVE",
                skipPaging: true,
                filter: `${RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_RESOURCE_ID_DATA_ELEMENT_ID}:eq:${resourceId}`,
            })
        )
            .flatMap(response =>
                assertOrError(
                    response.instances[0],
                    `No event found for resource with id ${resourceId} in disease outbreak event ${diseaseOutbreakEventId}`
                )
            )
            .flatMap((eventInDiseaseOutbreakToDelete: D2TrackerEvent) => {
                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "DELETE" },
                        { events: [eventInDiseaseOutbreakToDelete] }
                    )
                ).flatMap(response => {
                    if (response.status !== "OK") {
                        return Future.error(
                            new Error(`Error deleting resource: ${response.message}`)
                        );
                    } else return Future.success(undefined);
                });
            });
    }

    private async getAllD2TrackerEventResourcesAsync(options?: {
        ids?: Id[];
        diseaseOutbreakId?: Id;
    }): Promise<D2TrackerEvent[]> {
        const { ids, diseaseOutbreakId } = options || {};

        const d2TrackerEvents: D2TrackerEvent[] = [];
        const pageSize = 250;
        let page = 1;
        let result: TrackerEventsResponse;

        try {
            do {
                result = await this.api.tracker.events
                    .get({
                        program: RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_ID,
                        programStage: RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_STAGE_ID,
                        orgUnit: RTSL_ZEBRA_RESOURCES_ORG_UNIT_ID,
                        ouMode: "SELECTED",
                        totalPages: true,
                        page: page,
                        pageSize: pageSize,
                        fields: eventFields,
                        programStatus: "ACTIVE",
                        filter: diseaseOutbreakId
                            ? `${RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_DATA_ELEMENT_ID}:eq:${diseaseOutbreakId}`
                            : undefined,
                        ...(ids ? { event: ids.join(";") } : {}),
                    })
                    .getData();

                d2TrackerEvents.push(...result.instances);

                page++;
            } while (result.page < Math.ceil((result.total as number) / pageSize));
            return d2TrackerEvents;
        } catch {
            return [];
        }
    }
}
