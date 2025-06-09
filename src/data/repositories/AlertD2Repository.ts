import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import {
    AlertOptions,
    AlertRepository,
    UpdatePHEOCStatusOptions,
} from "../../domain/repositories/AlertRepository";
import { Code, Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { Alert, PHEOCStatus, VerificationStatus } from "../../domain/entities/alert/Alert";
import {
    getAllTrackedEntitiesAsync,
    ProgramStatus,
    programStatusOptions,
} from "./utils/getAllTrackedEntities";
import { getAlertValueFromMap } from "./utils/AlertOutbreakMapper";
import { IncidentStatus } from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { assertOrError } from "./utils/AssertOrError";
import { getDiseaseOptions } from "./common/getDiseaseOptions";

const incidentStatusOptionMap = new Map<IncidentStatus, string>([
    ["Alert", "PHEOC_STATUS_ALERT"],
    ["Respond", "PHEOC_STATUS_RESPOND"],
    ["Watch", "PHEOC_STATUS_WATCH"],
]);

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateActiveVerifiedRespondAlerts(alertOptions: AlertOptions): FutureData<Alert[]> {
        const { diseaseOutbreakEventId, diseaseCode } = alertOptions;

        if (!diseaseOutbreakEventId || !diseaseCode) {
            return Future.error(
                new Error("Disease outbreak ID and disease code are required to update alerts.")
            );
        }

        return this.getTrackedEntitiesByConfirmedDiseaseCode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            confirmedDisease: diseaseCode,
            programStatus: programStatusOptions.ACTIVE,
        }).flatMap(alertTrackedEntitiesByConfirmedDisease => {
            const alertsTrackedEntitiesToPost =
                this.getActiveVerifiedRespondAlertsWithoutDiseaseOutbreakId(
                    alertTrackedEntitiesByConfirmedDisease,
                    diseaseOutbreakEventId
                );
            const activeVerifiedAlerts: Alert[] = alertsTrackedEntitiesToPost
                .map(trackedEntity => {
                    const confirmedDisease = getAlertValueFromMap(
                        "confirmedDisease",
                        trackedEntity
                    );
                    if (!confirmedDisease) {
                        return undefined;
                    }

                    const suspectedDisease = getAlertValueFromMap(
                        "suspectedDisease",
                        trackedEntity
                    );
                    const alert: Alert = {
                        id: trackedEntity.trackedEntity || "",
                        districtId: trackedEntity.orgUnit || "",
                        confirmedDiseaseCode: confirmedDisease,
                        suspectedDiseaseCode: suspectedDisease,
                    };

                    return alert;
                })
                .filter((alert): alert is Alert => alert !== undefined);

            if (activeVerifiedAlerts.length === 0) return Future.success([]);

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: alertsTrackedEntitiesToPost }
                )
            ).flatMap(saveResponse => {
                if (saveResponse.status === "ERROR")
                    return Future.error(
                        new Error("Error mapping disease outbreak event id to alert")
                    );
                else return Future.success(activeVerifiedAlerts);
            });
        });
    }

    updateAlertPHEOCStatus(options: UpdatePHEOCStatusOptions): FutureData<void> {
        const { alertId, pheocStatus, diseaseOutbreakId } = options;

        return this._getAlertTrackedEntityById(alertId, {
            trackedEntityType: true,
            orgUnit: true,
        }).flatMap(alertTrackedEntity => {
            const alertsToPost: D2TrackerTrackedEntity = {
                trackedEntity: alertId,
                trackedEntityType: alertTrackedEntity.trackedEntityType,
                orgUnit: alertTrackedEntity.orgUnit,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID,
                        value: this.mapIncidentStatusToOption(pheocStatus),
                    },
                    {
                        attribute: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                        value: diseaseOutbreakId ?? "",
                    },
                ],
            };

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: [alertsToPost] }
                )
            ).flatMap(resp => {
                if (resp.status === "ERROR")
                    return Future.error(
                        new Error(`Error updating alert incident status : ${resp.message}`)
                    );
                else return Future.success(undefined);
            });
        });
    }

    getById(alertId: Id): FutureData<Alert> {
        return this._getAlertTrackedEntityById(alertId, {
            orgUnit: true,
            attributes: true,
            enrollments: true,
        }).flatMap(alertTrackedEntity => {
            const enrollment =
                alertTrackedEntity.enrollments && alertTrackedEntity.enrollments[0]
                    ? alertTrackedEntity.enrollments[0]
                    : undefined;

            if (!enrollment) {
                return Future.error(new Error(`Error fetching alert with id ${alertId}`));
            }

            const suspectedDisease = getAlertValueFromMap("suspectedDisease", alertTrackedEntity);
            const confirmedDisease = getAlertValueFromMap("confirmedDisease", alertTrackedEntity);
            const pheocStatus = getAlertValueFromMap("pheocStatus", alertTrackedEntity);
            const alert = {
                id: alertId,
                districtId: alertTrackedEntity.orgUnit || "",
                suspectedDiseaseCode: suspectedDisease,
                confirmedDiseaseCode: confirmedDisease,
                status: enrollment.status,
                incidentStatus: this.mapOptionToIncidentStatus(pheocStatus),
            };

            return Future.success(alert);
        });
    }

    private _getAlertTrackedEntityById(
        id: Id,
        fields?: AlertTrackerEntityFields
    ): FutureData<D2TrackerTrackedEntity> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                trackedEntity: id,
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                enrollmentEnrolledBefore: new Date().toISOString(),
                fields: fields || alertTrackerEntityFields,
            })
        ).flatMap(response =>
            assertOrError(response.instances[0], `Alert tracked entity with id ${id}`)
        );
    }

    updateAlertsPHEOCStatusByDiseaseOutbreakId(
        diseaseOutbreakId: Id,
        pheocStatus: IncidentStatus
    ): FutureData<void> {
        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                orgUnitId: RTSL_ZEBRA_ORG_UNIT_ID,
                ouMode: "DESCENDANTS",
                filter: {
                    id: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                    value: diseaseOutbreakId,
                },
                programStatus: programStatusOptions.ACTIVE,
            })
        ).flatMap(trackedEntities => {
            const trackedEntitiesToPost = trackedEntities.map(trackedEntity => ({
                trackedEntity: trackedEntity.trackedEntity,
                trackedEntityType: trackedEntity.trackedEntityType,
                orgUnit: trackedEntity.orgUnit,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID,
                        value: PHEOCStatus[pheocStatus],
                    },
                ],
            }));

            if (trackedEntitiesToPost.length === 0) return Future.success(undefined);

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: trackedEntitiesToPost }
                )
            ).flatMap(saveResponse => {
                if (saveResponse.status === "ERROR") {
                    return Future.error(new Error("Error updating alerts PHEOC status."));
                }

                return Future.success(undefined);
            });
        });
    }

    updateConfirmedDisease(alertId: Id, diseaseName: string): FutureData<void> {
        return Future.joinObj({
            alertTrackedEntity: this._getAlertTrackedEntityById(alertId, {
                orgUnit: true,
                attributes: true,
                trackedEntityType: true,
            }),
            diseaseOptions: getDiseaseOptions(this.api),
        }).flatMap(({ alertTrackedEntity, diseaseOptions }) => {
            const diseaseCode = diseaseOptions.options.find(
                option => option.name === diseaseName
            )?.code;
            if (!diseaseCode) {
                return Future.error(
                    new Error(`Disease with name ${diseaseName} not found in options.`)
                );
            }

            const alertsToPost: D2TrackerTrackedEntity = {
                trackedEntity: alertId,
                trackedEntityType: alertTrackedEntity.trackedEntityType,
                orgUnit: alertTrackedEntity.orgUnit,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_ID,
                        value: diseaseCode,
                    },
                ],
            };

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: [alertsToPost] }
                )
            ).flatMap(resp => {
                if (resp.status === "ERROR")
                    return Future.error(
                        new Error(`Error updating alert confirmed disease: ${resp.message}`)
                    );
                else return Future.success(undefined);
            });
        });
    }

    private mapIncidentStatusToOption(status: IncidentStatus): string {
        return incidentStatusOptionMap.get(status) || "";
    }

    private mapOptionToIncidentStatus(status: Maybe<string>): Maybe<IncidentStatus> {
        if (!status) return undefined;

        const incidentStatus = [...incidentStatusOptionMap.entries()].find(
            ([, value]) => value === status
        );
        return incidentStatus ? incidentStatus[0] : undefined;
    }

    private getActiveVerifiedRespondAlertsWithoutDiseaseOutbreakId(
        alertTrackedEntitiesByConfirmedDisease: D2TrackerTrackedEntity[],
        diseaseOutbreakEventId: Id
    ): D2TrackerTrackedEntity[] {
        return _(alertTrackedEntitiesByConfirmedDisease)
            .compactMap<D2TrackerTrackedEntity>(trackedEntity => {
                const isActive = trackedEntity.inactive === false;

                const verificationStatus = getAlertValueFromMap(
                    "verificationStatus",
                    trackedEntity
                );
                const isVerified =
                    verificationStatus === VerificationStatus.RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED;

                const pheocStatus = getAlertValueFromMap("pheocStatus", trackedEntity);
                const isRespondPheocStatus = pheocStatus === PHEOCStatus.Respond;

                const nationalEventId = getAlertValueFromMap("nationalEventId", trackedEntity);
                if (nationalEventId || !isActive || !isVerified || !isRespondPheocStatus)
                    return undefined;

                const restAttributes: Attribute[] =
                    trackedEntity.attributes?.filter(
                        attribute =>
                            attribute.attribute !==
                            RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
                    ) || [];

                return {
                    trackedEntity: trackedEntity.trackedEntity,
                    trackedEntityType: trackedEntity.trackedEntityType,
                    orgUnit: trackedEntity.orgUnit,
                    attributes: [
                        ...restAttributes,
                        {
                            attribute: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                            value: diseaseOutbreakEventId,
                        },
                    ],
                };
            })
            .value();
    }

    private getTrackedEntitiesByConfirmedDiseaseCode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        confirmedDisease: Code;
        programStatus?: ProgramStatus;
    }): FutureData<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode, confirmedDisease, programStatus } = options;

        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: program,
                orgUnitId: orgUnit,
                ouMode: ouMode,
                filter: {
                    id: RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_ID,
                    value: confirmedDisease,
                },
                programStatus: programStatus,
            })
        );
    }
}
const alertTrackerEntityFields = {
    orgUnit: true,
    attributes: true,
    enrollments: true,
    trackedEntityType: true,
} as const;

type AlertTrackerEntityFields = Partial<typeof alertTrackerEntityFields>;
