import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { AlertOptions, AlertRepository } from "../../domain/repositories/AlertRepository";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Alert } from "../../domain/entities/alert/Alert";
import { OutbreakData } from "../../domain/entities/alert/OutbreakAlert";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import { outbreakDataSourceMapping, outbreakTEAMapping } from "./utils/AlertOutbreakMapper";
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
        const { dataSource, eventId, incidentStatus, outbreakValue } = alertOptions;
        const outbreakData = this.getAlertOutbreakData(dataSource, outbreakValue);

        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            filter: outbreakData,
        }).flatMap(alertTrackedEntities => {
            const alertsToMap: Alert[] = alertTrackedEntities.map(trackedEntity => ({
                id: trackedEntity.trackedEntity || "",
                district: trackedEntity.orgUnit || "",
            }));

            const alertsToPost: D2TrackerTrackedEntity[] = alertTrackedEntities.map(
                trackedEntity => ({
                    trackedEntity: trackedEntity.trackedEntity,
                    trackedEntityType: trackedEntity.trackedEntityType,
                    orgUnit: trackedEntity.orgUnit,
                    attributes: [
                        {
                            attribute: RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                            value: eventId,
                        },
                        {
                            attribute: RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
                            value: incidentStatus,
                        },
                    ],
                })
            );

            if (alertsToMap.length === 0) return Future.success([]);

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
                else return Future.success(alertsToMap);
            });
        });
    }

    updateAlertIncidentStatus(
        alertId: Id,
        orgUnitName: string,
        status: IncidentStatus
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
                        attribute: RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
                        value: this.mapIncidentStatusToOption(status),
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
                attr => attr.attribute === RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID
            )?.value;

            return Future.success(this.mapOptionToIncidentStatus(status));
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

    private getAlertOutbreakData(
        dataSource: DataSource,
        outbreakValue: Maybe<string>
    ): OutbreakData {
        return {
            type: outbreakDataSourceMapping[dataSource],
            value: outbreakValue,
        };
    }
}
