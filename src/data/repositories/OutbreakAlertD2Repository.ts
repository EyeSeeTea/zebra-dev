import { D2Api } from "@eyeseetea/d2-api/2.36";
import { OutbreakAlert, OutbreakData } from "../../domain/entities/alert/OutbreakAlert";
import { OutbreakAlertRepository } from "../../domain/repositories/OutbreakAlertRepository";
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
} from "./consts/DiseaseOutbreakConstants";
import { Id } from "../../domain/entities/Ref";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import _ from "../../domain/entities/generic/Collection";
import { getTEAttributeById } from "./utils/MetadataHelper";
import { AlertDataSource } from "../../domain/entities/alert/Alert";
import { mapTrackedEntityAttributesToNotificationOptions } from "./utils/AlertOutbreakMapper";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { NotificationOptions } from "../../domain/repositories/NotificationRepository";

export class OutbreakAlertD2Repository implements OutbreakAlertRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<OutbreakAlert[]> {
        return this.getAlertTrackedEntities().map(alertTEIs => {
            return this.getOutbreakAlerts(alertTEIs);
        });
    }

    private getOutbreakAlerts(alertTrackedEntities: D2TrackerTrackedEntity[]): OutbreakAlert[] {
        // these are alerts that have no national event id
        const alertsWithNoEventId = _(alertTrackedEntities)
            .compactMap(trackedEntity => {
                const { diseaseType, nationalEventId } = this.getAlertTEAttributes(trackedEntity);
                const notificationOptions =
                    mapTrackedEntityAttributesToNotificationOptions(trackedEntity);
                const outbreakData = this.getOutbreakData(diseaseType);

                if (!outbreakData) return undefined;

                const dataSource = this.getAlertDataSource(diseaseType);
                if (!dataSource) return undefined;

                const alertData: OutbreakAlert = this.buildAlertData(
                    trackedEntity,
                    outbreakData,
                    dataSource,
                    notificationOptions
                );

                return !nationalEventId && diseaseType ? alertData : undefined;
            })
            .value();

        return alertsWithNoEventId;
    }

    private getAlertDataSource(diseaseType: Maybe<Attribute>): Maybe<AlertDataSource> {
        if (diseaseType) return AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS;
        else return undefined;
    }

    private buildAlertData(
        trackedEntity: D2TrackerTrackedEntity,
        outbreakData: OutbreakData,
        dataSource: AlertDataSource,
        notificationOptions: NotificationOptions
    ): OutbreakAlert {
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

    private getOutbreakData(diseaseType: Maybe<Attribute>): Maybe<OutbreakData> {
        return diseaseType ? { value: diseaseType.value, type: "disease" } : undefined;
    }

    private getAlertTEAttributes(trackedEntity: D2TrackerTrackedEntity) {
        const nationalEventId = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
        );
        const diseaseType = getTEAttributeById(trackedEntity, RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID);

        return { diseaseType, nationalEventId };
    }

    private getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
    }): FutureData<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode } = options;

        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: program,
                orgUnitId: orgUnit,
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
