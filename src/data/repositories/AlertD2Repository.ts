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
import {
    DataSource,
    NationalIncidentStatus,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Alert, VerificationStatus } from "../../domain/entities/alert/Alert";
import { OutbreakData } from "../../domain/entities/alert/OutbreakAlert";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import {
    getAlertValueFromMap,
    outbreakDataSourceMapping,
    outbreakTEAMapping,
} from "./utils/AlertOutbreakMapper";

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]> {
        const { dataSource, eventId, incidentStatus, outbreakValue } = alertOptions;
        const outbreakData = this.getAlertOutbreakData(dataSource, outbreakValue);

        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            filter: outbreakData,
        }).flatMap(alertTrackedEntities => {
            const activeVerifiedAlerts = this.getActiveVerifiedAlerts(alertTrackedEntities);

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

    private getActiveVerifiedAlerts(trackedEntities: D2TrackerTrackedEntity[]): Alert[] {
        return _(trackedEntities)
            .compactMap<Alert>(trackedEntity => {
                const isActive = trackedEntity.inactive === false;
                const verificationStatus = getAlertValueFromMap(
                    "verificationStatus",
                    trackedEntity
                );
                const isVerified =
                    verificationStatus === VerificationStatus.RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED;
                const incidentStatus = getAlertValueFromMap("incidentStatus", trackedEntity);

                const isRespondIncidentStatus =
                    incidentStatus === NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_RESPOND;

                if (!isActive || !isVerified || !isRespondIncidentStatus) return undefined;

                return {
                    id: trackedEntity.trackedEntity || "",
                    district: trackedEntity.orgUnit || "",
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
