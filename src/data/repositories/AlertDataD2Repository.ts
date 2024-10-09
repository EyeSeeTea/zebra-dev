import { D2Api } from "@eyeseetea/d2-api/2.36";
import { AlertData, OutbreakData } from "../../domain/entities/alert/AlertData";
import { AlertDataRepository } from "../../domain/repositories/AlertDataRepository";
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
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
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { NotificationOptions } from "../../domain/repositories/NotificationRepository";

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
                const { diseaseType, hazardType, nationalEventId } =
                    this.getAlertTEAttributes(trackedEntity);
                const notificationOptions =
                    mapTrackedEntityAttributesToNotificationOptions(trackedEntity);
                const outbreakData = this.getOutbreakData(diseaseType, hazardType);

                if (!outbreakData) return undefined;

                const dataSource = diseaseType
                    ? DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS
                    : DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS;

                const alertData: AlertData = this.buildAlertData(
                    trackedEntity,
                    outbreakData,
                    dataSource,
                    notificationOptions
                );

                return !nationalEventId && (hazardType || diseaseType) ? alertData : undefined;
            })
            .value();

        return Future.success(alertsWithNoEventId);
    }

    private buildAlertData(
        trackedEntity: D2TrackerTrackedEntity,
        outbreakData: OutbreakData,
        dataSource: DataSource,
        notificationOptions: NotificationOptions
    ): AlertData {
        if (!trackedEntity.trackedEntity || !trackedEntity.orgUnit)
            throw new Error(`Alert data not found for ${outbreakData.value}`);

        return {
            alert: {
                id: trackedEntity.trackedEntity,
                district: trackedEntity.orgUnit,
            },
            outbreakData: outbreakData,
            dataSource: dataSource,
            notificationOptions: notificationOptions,
        };
    }

    private getOutbreakData(
        diseaseType: Maybe<Attribute>,
        hazardType: Maybe<Attribute>
    ): Maybe<OutbreakData> {
        return diseaseType
            ? { id: diseaseType.attribute, value: diseaseType.value }
            : hazardType
            ? { id: hazardType.value, value: hazardType.value }
            : undefined;
    }

    private getAlertTEAttributes(trackedEntity: D2TrackerTrackedEntity) {
        const nationalEventId = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
        );
        const hazardType = getTEAttributeById(trackedEntity, RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID);
        const diseaseType = getTEAttributeById(trackedEntity, RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID);
        return { diseaseType, hazardType, nationalEventId };
    }

    private getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
        filter?: OutbreakData;
    }): FutureData<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode, filter } = options;

        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: program,
                orgUnitId: orgUnit,
                filter: filter,
                ouMode: ouMode,
            })
        );
    }

    private getAlertTrackedEntities(): FutureData<D2TrackerTrackedEntity[]> {
        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
        });
    }
}
