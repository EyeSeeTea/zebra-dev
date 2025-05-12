import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
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

export class AlertD2Repository implements AlertRepository {
    constructor(private api: D2Api) {}

    updateAlerts(alertOptions: AlertOptions): FutureData<Alert[]> {
        const { eventId, outbreakValue } = alertOptions;
        const outbreakData = this.getAlertOutbreakData(outbreakValue);

        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
            filter: outbreakData,
        }).flatMap(alertTrackedEntities => {
            const alertsToPost = this.getAlertsToPost(alertTrackedEntities, eventId);
            const activeVerifiedAlerts = alertsToPost.map<Alert>(trackedEntity => ({
                id: trackedEntity.trackedEntity || "",
                district: trackedEntity.orgUnit || "",
            }));

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

    private getAlertsToPost(
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

                if (!isActive || !isVerified || !isRespondPheocStatus) return undefined;

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
