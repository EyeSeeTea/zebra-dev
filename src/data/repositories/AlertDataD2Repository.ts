import { D2Api } from "@eyeseetea/d2-api/2.36";
import { AlertData, OutbreakData } from "../../domain/entities/alert/AlertData";
import { AlertDataRepository } from "../../domain/repositories/AlertDataRepository";
import {
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { Id } from "../../domain/entities/Ref";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import _ from "../../domain/entities/generic/Collection";
import { getTEAttributeById } from "./utils/MetadataHelper";
import { DataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { mapTrackedEntityAttributesToNotificationOptions } from "./utils/AlertOutbreakMapper";

export class AlertDataD2Repository implements AlertDataRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<AlertData[]> {
        return this.getAlertTrackedEntities().flatMap(alertTEIs => {
            const alertsWithNoEventId = this.getAlertData(alertTEIs);

            return alertsWithNoEventId;
        });
    }

    private getAlertData(alertTrackedEntities: D2TrackerTrackedEntity[]): FutureData<AlertData[]> {
        const alertsWithNoEventId = _(alertTrackedEntities)
            .compactMap(trackedEntity => {
                const nationalEventId = getTEAttributeById(
                    trackedEntity,
                    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
                );
                const hazardType = getTEAttributeById(
                    trackedEntity,
                    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID
                );
                const diseaseType = getTEAttributeById(
                    trackedEntity,
                    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID
                );

                const notificationOptions =
                    mapTrackedEntityAttributesToNotificationOptions(trackedEntity);

                const outbreakData = diseaseType
                    ? { id: diseaseType.attribute, value: diseaseType.value }
                    : hazardType
                    ? { id: hazardType.value, value: hazardType.value }
                    : undefined;

                if (!outbreakData) return undefined;
                if (!trackedEntity.trackedEntity || !trackedEntity.orgUnit)
                    throw new Error("Tracked entity not found");

                const alertData: AlertData = {
                    alert: {
                        id: trackedEntity.trackedEntity,
                        district: trackedEntity.orgUnit,
                    },
                    outbreakData: outbreakData,
                    dataSource: diseaseType
                        ? DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS
                        : DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
                    notificationOptions: notificationOptions,
                };

                return !nationalEventId && (hazardType || diseaseType) ? alertData : undefined;
            })
            .value();

        return Future.success(alertsWithNoEventId);
    }

    private async getTrackedEntitiesByTEACodeAsync(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter?: OutbreakData;
    }): Promise<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode, filter } = options;
        const d2TrackerTrackedEntities: D2TrackerTrackedEntity[] = [];

        const pageSize = 250;
        let page = 1;
        let result: TrackedEntitiesGetResponse;

        try {
            do {
                result = await this.api.tracker.trackedEntities
                    .get({
                        program: program,
                        orgUnit: orgUnit,
                        ouMode: ouMode,
                        totalPages: true,
                        page: page,
                        pageSize: pageSize,
                        fields: {
                            attributes: true,
                            orgUnit: true,
                            trackedEntity: true,
                            trackedEntityType: true,
                            enrollments: {
                                events: {
                                    createdAt: true,
                                    dataValues: {
                                        dataElement: true,
                                        value: true,
                                    },
                                    event: true,
                                },
                            },
                        },
                        filter: filter ? `${filter.id}:eq:${filter.value}` : undefined,
                    })
                    .getData();

                d2TrackerTrackedEntities.push(...result.instances);

                page++;
            } while (result.page < Math.ceil((result.total as number) / pageSize));
            return d2TrackerTrackedEntities;
        } catch {
            return [];
        }
    }

    private getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter?: OutbreakData;
    }): FutureData<D2TrackerTrackedEntity[]> {
        return Future.fromPromise(this.getTrackedEntitiesByTEACodeAsync(options));
    }

    private getAlertTrackedEntities(): FutureData<D2TrackerTrackedEntity[]> {
        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
        });
    }
}
