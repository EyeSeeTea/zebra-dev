import { D2Api } from "@eyeseetea/d2-api/2.36";
import { OutbreakAlert, OutbreakData } from "../../domain/entities/alert/OutbreakAlert";
import { OutbreakAlertRepository } from "../../domain/repositories/OutbreakAlertRepository";
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
                const { diseaseType, hazardType, nationalEventId } =
                    this.getAlertTEAttributes(trackedEntity);
                const notificationOptions =
                    mapTrackedEntityAttributesToNotificationOptions(trackedEntity);
                const outbreakData = this.getOutbreakData(diseaseType, hazardType);

                if (!outbreakData) return undefined;

                const dataSource = this.getAlertDataSource(diseaseType, hazardType);
                if (!dataSource) return undefined;

                const alertData: OutbreakAlert = this.buildAlertData(
                    trackedEntity,
                    outbreakData,
                    dataSource,
                    notificationOptions
                );

                return !nationalEventId && (hazardType || diseaseType) ? alertData : undefined;
            })
            .value();

        return alertsWithNoEventId;
    }

    private getAlertDataSource(
        diseaseType: Maybe<Attribute>,
        hazardType: Maybe<Attribute>
    ): Maybe<DataSource> {
        if (diseaseType) return DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS;
        else if (hazardType) return DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS;
        else return undefined;
    }

    private buildAlertData(
        trackedEntity: D2TrackerTrackedEntity,
        outbreakData: OutbreakData,
        dataSource: DataSource,
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

    private getOutbreakData(
        diseaseType: Maybe<Attribute>,
        hazardType: Maybe<Attribute>
    ): Maybe<OutbreakData> {
        switch (true) {
            case !!diseaseType:
                return { value: diseaseType.value, type: "disease" };
            case !!hazardType:
                return { value: hazardType.value, type: "hazard" };
            default:
                return undefined;
        }
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
