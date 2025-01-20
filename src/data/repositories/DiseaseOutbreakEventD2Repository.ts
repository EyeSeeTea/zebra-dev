import { D2Api } from "../../types/d2-api";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { apiToFuture, FutureData } from "../api-futures";
import {
    CaseData,
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "../../domain/entities/Ref";
import {
    mapDiseaseOutbreakEventToTrackedEntityAttributes,
    mapTrackedEntityAttributesToDiseaseOutbreak,
} from "./utils/DiseaseOutbreakMapper";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    D2ProgramStageDataElement,
    getProgramDataElementsMetadata,
    getProgramTEAsMetadata,
} from "./utils/MetadataHelper";
import { assertOrError } from "./utils/AssertOrError";
import { Future } from "../../domain/entities/generic/Future";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import { D2TrackerEnrollment } from "@eyeseetea/d2-api/api/trackerEnrollments";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    CasesDataCode,
    CasesDataKeyCode,
    RTSL_ZEBRA_CASE_PROGRAM_ID,
    RTSL_ZEBRA_CASE_PROGRAM_STAGE_ID,
    RTSL_ZEB_DET_NATIONAL_EVENT_ID_ID,
    getCasesDataValuesFromDiseaseOutbreak,
    isStringInCasesDataCodes,
} from "./consts/CaseDataConstants";
import { OutbreakData, OutbreakDataType } from "../../domain/entities/alert/OutbreakAlert";

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
            getAllTrackedEntitiesAsync(this.api, {
                programId: RTSL_ZEBRA_PROGRAM_ID,
                orgUnitId: RTSL_ZEBRA_ORG_UNIT_ID,
            })
        ).map(trackedEntities => {
            return trackedEntities
                .map(trackedEntity => {
                    return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
                })
                .filter(outbreak => outbreak.status === "ACTIVE");
        });
    }

    getEventByDiseaseOrHazardType(
        filter: OutbreakData
    ): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: RTSL_ZEBRA_PROGRAM_ID,
                orgUnitId: RTSL_ZEBRA_ORG_UNIT_ID,
                filter: {
                    id: this.getDiseaseOutbreakFilterId(filter),
                    value: filter.value,
                },
            })
        ).map(trackedEntities => {
            return trackedEntities.map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
        });
    }

    private getDiseaseOutbreakFilterId(filter: OutbreakData): string {
        const mapping: Record<OutbreakDataType, TrackedEntityAttributeId> = {
            disease: RTSL_ZEBRA_DISEASE_TEA_ID,
            hazard: RTSL_ZEBRA_HAZARD_TEA_ID,
        };

        return mapping[filter.type];
    }

    save(diseaseOutbreak: DiseaseOutbreakEvent, haveChangedCasesData?: boolean): FutureData<Id> {
        const hasNewCasesData = !diseaseOutbreak.id && !!diseaseOutbreak.uploadedCasesData;

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
                        const diseaseOutbreakWithId = new DiseaseOutbreakEvent({
                            ...diseaseOutbreak,
                            id: diseaseOutbreakId,
                        });
                        if (hasNewCasesData || haveChangedCasesData) {
                            if (haveChangedCasesData) {
                                // NOTICE: If the cases data has changed, we need to replace the old one with the new one
                                return this.deleteCasesData(diseaseOutbreakWithId).flatMap(() => {
                                    return this.saveCasesData(diseaseOutbreakWithId).flatMap(() =>
                                        Future.success(diseaseOutbreakId)
                                    );
                                });
                            } else {
                                return this.saveCasesData(diseaseOutbreakWithId).flatMap(() =>
                                    Future.success(diseaseOutbreakId)
                                );
                            }
                        } else {
                            return Future.success(diseaseOutbreakId);
                        }
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
                } else {
                    return this.markCasesDataAsCompleted(id).flatMap(() =>
                        Future.success(undefined)
                    );
                }
            });
        });
    }

    private markCasesDataAsCompleted(diseaseOutbreakId: Id): FutureData<void> {
        return this.getd2EventCasesDataByDiseaseOutbreakId(diseaseOutbreakId).flatMap(d2Events => {
            if (!d2Events.length) {
                return Future.success(undefined);
            }

            const d2CompletedEvents = d2Events.map(
                (d2Event: D2TrackerEvent): D2TrackerEvent => ({
                    ...d2Event,
                    status: "COMPLETED",
                })
            );
            return apiToFuture(
                this.api.tracker.post({ importStrategy: "UPDATE" }, { events: d2CompletedEvents })
            ).flatMap(response => {
                if (response.status !== "OK") {
                    return Future.error(
                        new Error(
                            `Error while marking the cases data as completed: ${response.message}`
                        )
                    );
                } else return Future.success(undefined);
            });
        });
    }

    private getd2EventCasesDataByDiseaseOutbreakId(
        diseaseOutbreakId: Id
    ): FutureData<D2TrackerEvent[]> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: RTSL_ZEBRA_CASE_PROGRAM_ID,
                programStage: RTSL_ZEBRA_CASE_PROGRAM_STAGE_ID,
                fields: {
                    program: true,
                    orgUnit: true,
                    dataValues: {
                        dataElement: { id: true, code: true },
                        value: true,
                    },
                    event: true,
                    occurredAt: true,
                    status: true,
                },
                filter: `${RTSL_ZEB_DET_NATIONAL_EVENT_ID_ID}:eq:${diseaseOutbreakId}`,
            })
        )
            .flatMap(response =>
                assertOrError(
                    response.instances,
                    `Error fetching cases data for disease outbreak ${diseaseOutbreakId}`
                )
            )
            .flatMap(d2Events => {
                return Future.success(d2Events);
            });
    }

    private saveCasesData(diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void> {
        return getProgramDataElementsMetadata(this.api, RTSL_ZEBRA_CASE_PROGRAM_ID)
            .flatMap(response =>
                assertOrError(response.objects[0], `Case program metadata not found`)
            )
            .flatMap(programDataElementsMetadataResponse => {
                const programDataElements: D2ProgramStageDataElement[] | undefined =
                    programDataElementsMetadataResponse.programStages.find(
                        programStage => programStage.id === RTSL_ZEBRA_CASE_PROGRAM_STAGE_ID
                    )?.programStageDataElements;

                if (!diseaseOutbreak.uploadedCasesData || !programDataElements)
                    return Future.error(
                        new Error(`Cases data or case program data elements not found.`)
                    );

                const d2TrackerEvents = diseaseOutbreak.uploadedCasesData.map(caseData =>
                    this.mapCaseDataToD2TrackerEvents(
                        caseData,
                        diseaseOutbreak,
                        programDataElements
                    )
                );

                return apiToFuture(
                    this.api.tracker.post({ importStrategy: "CREATE" }, { events: d2TrackerEvents })
                ).flatMap(response => {
                    if (response.status !== "OK") {
                        return Future.error(
                            new Error(`Error saving cases data: ${response.message}`)
                        );
                    } else return Future.success(undefined);
                });
            });
    }

    private deleteCasesData(diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void> {
        return this.getd2EventCasesDataByDiseaseOutbreakId(diseaseOutbreak.id).flatMap(d2Events => {
            return apiToFuture(
                this.api.tracker.post({ importStrategy: "DELETE" }, { events: d2Events })
            ).flatMap(response => {
                if (response.status !== "OK") {
                    return Future.error(
                        new Error(`Error deleting cases data: ${response.message}`)
                    );
                } else return Future.success(undefined);
            });
        });
    }

    private mapCaseDataToD2TrackerEvents(
        caseData: CaseData,
        diseaseOutbreak: DiseaseOutbreakEvent,
        programDataElements: D2ProgramStageDataElement[]
    ): D2TrackerEvent {
        const casesDataValuesByCode: Record<CasesDataCode, string> =
            getCasesDataValuesFromDiseaseOutbreak(caseData, diseaseOutbreak);

        const dataValues = programDataElements.map(({ dataElement }) => {
            if (!isStringInCasesDataCodes(dataElement.code)) {
                throw new Error("Data element code not found in cases data");
            }
            const typedCode: CasesDataKeyCode = dataElement.code;
            return {
                dataElement: dataElement.id,
                value: casesDataValuesByCode[typedCode],
            };
        });

        return {
            event: "",
            program: RTSL_ZEBRA_CASE_PROGRAM_ID,
            programStage: RTSL_ZEBRA_CASE_PROGRAM_STAGE_ID,
            orgUnit: caseData.orgUnit,
            occurredAt: caseData.reportDate,
            status: "ACTIVE",
            dataValues,
        };
    }

    //TO DO : Implement delete/archive after requirement confirmation
}

const RTSL_ZEBRA_DISEASE_TEA_ID = "jLvbkuvPdZ6";
const RTSL_ZEBRA_HAZARD_TEA_ID = "Dzrw3Tf0ukB";

type TrackedEntityAttributeId = Id;
