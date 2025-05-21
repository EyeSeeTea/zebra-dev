import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { AlertOptions, AlertRepository } from "../../domain/repositories/AlertRepository";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { Alert, PHEOCStatus, VerificationStatus } from "../../domain/entities/alert/Alert";
import { OutbreakData } from "../../domain/entities/alert/OutbreakAlert";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import { getAlertValueFromMap, outbreakTEAMapping } from "./utils/AlertOutbreakMapper";
import { IncidentStatus } from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

const ALERT_TRACKED_ENTITY_TYPE = "QH1LBzGrk5g";

const incidentStatusOptionMap = new Map<IncidentStatus, string>([
    ["Alert", "PHEOC_STATUS_ALERT"],
    ["Respond", "PHEOC_STATUS_RESPOND"],
    ["Watch", "PHEOC_STATUS_WATCH"],
]);

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    //TO DO : Remove this automatic mapping of alerts to disease as per R3 requirements.
    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]> {
        const { eventId, outbreakValue } = alertOptions;
        const outbreakData = this.getAlertOutbreakData(outbreakValue);

        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            filter: outbreakData,
        }).flatMap(alertTrackedEntities => {
            const alertsToPost = this.getRespondAlertsToPost(alertTrackedEntities, eventId);
            const activeVerifiedAlerts = alertsToPost.map<Alert>(trackedEntity => {
                const disease = getAlertValueFromMap("suspectedDisease", trackedEntity);
                return {
                    id: trackedEntity.trackedEntity || "",
                    district: trackedEntity.orgUnit || "",
                    disease: disease,
                };
            });

            if (activeVerifiedAlerts.length === 0) return Future.success([]);

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: alertsToPost }
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

    updateAlertPHEOCStatus(
        alertId: Id,
        orgUnitName: string,
        pheocStatus: IncidentStatus
    ): FutureData<void> {
        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: { id: true },
                filter: { name: { eq: orgUnitName } },
            })
        ).flatMap(resp => {
            if (!resp.objects[0]) {
                return Future.error(
                    new Error(`Error fetching organisation unit id for ${orgUnitName}`)
                );
            }
            const orgUnitId = resp.objects[0].id;
            const alertsToPost: D2TrackerTrackedEntity = {
                trackedEntity: alertId,
                trackedEntityType: ALERT_TRACKED_ENTITY_TYPE,
                orgUnit: orgUnitId,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID,
                        value: this.mapIncidentStatusToOption(pheocStatus),
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

    getIncidentStatusByAlert(alertId: Id): FutureData<Maybe<IncidentStatus>> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                trackedEntity: alertId,
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                enrollmentEnrolledBefore: new Date().toISOString(),
                fields: { attributes: true },
            })
        ).flatMap(trackedEntityResponse => {
            const status = trackedEntityResponse.instances[0]?.attributes?.find(
                attr => attr.attribute === RTSL_ZEBRA_ALERTS_PHEOC_STATUS_ID
            )?.value;

            return Future.success(this.mapOptionToIncidentStatus(status));
        });
    }

    getAlertById(alertId: Id): FutureData<Alert> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                trackedEntity: alertId,
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                enrollmentEnrolledBefore: new Date().toISOString(),
                fields: { orgUnit: true, attributes: true, enrollments: true },
            })
        ).flatMap(trackedEntityResponse => {
            const alertTrackedEntity = trackedEntityResponse.instances[0];

            if (!alertTrackedEntity) {
                return Future.error(new Error(`Error fetching alert with id ${alertId}`));
            }

            const enrollment =
                alertTrackedEntity.enrollments && alertTrackedEntity.enrollments[0]
                    ? alertTrackedEntity.enrollments[0]
                    : undefined;

            if (!enrollment) {
                return Future.error(new Error(`Error fetching alert with id ${alertId}`));
            }

            const disease = getAlertValueFromMap("suspectedDisease", alertTrackedEntity);
            const alert = {
                id: alertId,
                district: alertTrackedEntity.orgUnit || "",
                disease: disease,
                status: enrollment.status,
            };

            return Future.success(alert);
        });
    }

    updateMappedDiseaseOutbreakEventIdByPHEOCStatus(
        alertId: Id,
        diseaseOutbreakId: Id,
        pheocStatus: IncidentStatus
    ): FutureData<void> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                trackedEntity: alertId,
                program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                enrollmentEnrolledBefore: new Date().toISOString(),
                fields: { trackedEntityType: true, orgUnit: true },
            })
        ).flatMap(alertTrackedEntityResponse => {
            const alertTrackedEntity = alertTrackedEntityResponse.instances[0];
            if (!alertTrackedEntity) {
                return Future.error(new Error(`Error fetching alert with id ${alertId}`));
            }

            const updatedMappedDiseaseOutbreakEventId =
                pheocStatus === "Respond" ? diseaseOutbreakId : "";

            const updatedAlert: D2TrackerTrackedEntity = {
                trackedEntity: alertId,
                trackedEntityType: alertTrackedEntity.trackedEntityType,
                orgUnit: alertTrackedEntity.orgUnit,
                attributes: [
                    {
                        attribute: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                        value: updatedMappedDiseaseOutbreakEventId,
                    },
                ],
            };

            return apiToFuture(
                this.api.tracker.post(
                    { importStrategy: "UPDATE" },
                    { trackedEntities: [updatedAlert] }
                )
            ).flatMap(response => {
                if (response.status === "ERROR")
                    return Future.error(
                        new Error(
                            `Error updating mapped disease outbreak event id in alert ${alertId} with new value: ${updatedMappedDiseaseOutbreakEventId}`
                        )
                    );
                else return Future.success(undefined);
            });
        });
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

    private getRespondAlertsToPost(
        trackedEntities: D2TrackerTrackedEntity[],
        eventId: string
    ): D2TrackerTrackedEntity[] {
        return _(trackedEntities)
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

                return {
                    trackedEntity: trackedEntity.trackedEntity,
                    trackedEntityType: trackedEntity.trackedEntityType,
                    orgUnit: trackedEntity.orgUnit,
                    attributes: [
                        {
                            attribute: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                            value: eventId,
                        },
                    ],
                };
            })
            .value();
    }

    private getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter: OutbreakData;
    }): FutureData<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode, filter } = options;

        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: program,
                orgUnitId: orgUnit,
                ouMode: ouMode,
                filter: {
                    id: this.getOutbreakFilterId(filter),
                    value: filter.value,
                },
            })
        );
    }

    private getOutbreakFilterId(filter: OutbreakData): string {
        return outbreakTEAMapping[filter.type];
    }

    private getAlertOutbreakData(outbreakValue: Maybe<string>): OutbreakData {
        return {
            type: "disease",
            value: outbreakValue,
        };
    }
}
