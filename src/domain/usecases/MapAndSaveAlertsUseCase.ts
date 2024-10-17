import { Future } from "../entities/generic/Future";
import { Option } from "../entities/Ref";
import { AlertOptions, AlertRepository } from "../repositories/AlertRepository";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import _ from "../entities/generic/Collection";
import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { logger } from "../../utils/logger";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { UserGroupRepository } from "../repositories/UserGroupRepository";
import { AlertData, OutbreakData } from "../entities/alert/AlertData";
import { AlertDataRepository } from "../repositories/AlertDataRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { getOutbreakKey } from "../entities/alert/AlertSynchronizationData";
import { promiseMap } from "../../utils/promiseMap";

export class MapAndSaveAlertsUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            alertDataRepository: AlertDataRepository;
            alertSyncRepository: AlertSyncRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            notificationRepository: NotificationRepository;
            optionsRepository: OptionsRepository;
            userGroupRepository: UserGroupRepository;
        }
    ) {}

    public async execute(): Promise<void> {
        const { hazardTypes, suspectedDiseases } = await this.getOptions();
        const alertData = await this.options.alertDataRepository.get().toPromise();

        logger.info(
            `${alertData.length} event(s) found in the Zebra Alerts program with no national event id.`
        );

        const uniqueFiltersWithAlerts = _(alertData)
            .groupBy(alert => alert.dataSource)
            .values()
            .flatMap(alertsByDataSource => {
                return getUniqueFilters(alertsByDataSource).map(outbreakData => ({
                    outbreakData: outbreakData,
                    alerts: alertsByDataSource,
                }));
            });

        await promiseMap(uniqueFiltersWithAlerts, async uniqueFilterWithAlerts => {
            const { outbreakData, alerts } = uniqueFilterWithAlerts;

            return this.mapDiseaseOutbreakToAlertsAndSave(
                alerts,
                outbreakData,
                hazardTypes,
                suspectedDiseases
            );
        });
    }

    private async mapDiseaseOutbreakToAlertsAndSave(
        alertData: AlertData[],
        outbreakData: OutbreakData,
        hazardTypes: Option[],
        suspectedDiseases: Option[]
    ): Promise<void> {
        const diseaseOutbreakEvents = await this.getDiseaseOutbreakEvents(outbreakData);
        const dataSource =
            outbreakData.type === "disease"
                ? DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS
                : DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS;

        if (diseaseOutbreakEvents.length > 1) {
            const outbreakKey = getOutbreakKey({
                dataSource: dataSource,
                outbreakValue: outbreakData.value,
                hazardTypes: hazardTypes,
                suspectedDiseases: suspectedDiseases,
            });

            return logger.error(`More than 1 National event found for ${outbreakKey} outbreak.`);
        }

        const outbreakAlerts = alertData.filter(
            alertData => alertData.outbreakData.value === outbreakData.value
        );

        await promiseMap(outbreakAlerts, alertData => {
            return this.mapAndSaveAlertData(
                alertData,
                diseaseOutbreakEvents,
                hazardTypes,
                suspectedDiseases
            );
        });
    }

    private getDiseaseOutbreakEvents(
        outbreakData: OutbreakData
    ): Promise<DiseaseOutbreakEventBaseAttrs[]> {
        return this.options.diseaseOutbreakEventRepository
            .getEventByDiseaseOrHazardType(outbreakData)
            .toPromise();
    }

    private getOptions(): Promise<{ hazardTypes: Option[]; suspectedDiseases: Option[] }> {
        const { optionsRepository } = this.options;

        return Future.joinObj({
            hazardTypes: optionsRepository.getHazardTypesByCode(),
            suspectedDiseases: optionsRepository.getSuspectedDiseases(),
        }).toPromise();
    }

    private mapAndSaveAlertData(
        alertData: AlertData,
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[],
        hazardTypes: Option[],
        suspectedDiseases: Option[]
    ): Promise<void> {
        const { dataSource, outbreakData } = alertData;

        const outbreakType = outbreakData.type;
        const outbreakName = getOutbreakKey({
            dataSource: dataSource,
            outbreakValue: outbreakData.value,
            hazardTypes: hazardTypes,
            suspectedDiseases: suspectedDiseases,
        });

        if (diseaseOutbreakEvents.length === 0) {
            return this.notifyNationalWatchStaff(alertData, outbreakType, outbreakName);
        }

        const diseaseOutbreakEvent = diseaseOutbreakEvents[0];
        if (!diseaseOutbreakEvent)
            return logger.error(
                `No disease outbreak event found for ${outbreakType} type ${outbreakName}.`
            );

        return this.updateAlertData({
            alertData: alertData,
            diseaseOutbreakEvent: diseaseOutbreakEvent,
            hazardTypes: hazardTypes,
            suspectedDiseases: suspectedDiseases,
        });
    }

    private async notifyNationalWatchStaff(
        alertData: AlertData,
        alertOutbreakType: string,
        outbreakName: string
    ): Promise<void> {
        const { notificationRepository, userGroupRepository } = this.options;
        logger.debug(`There is no national event with ${outbreakName} ${alertOutbreakType} type.`);

        const userGroup = await userGroupRepository
            .getUserGroupByCode(RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE)
            .toPromise();

        return notificationRepository
            .notifyNationalWatchStaff(alertData, outbreakName, [userGroup])
            .toPromise()
            .then(() => logger.success("Successfully notified all national watch staff."));
    }

    private async updateAlertData(options: {
        alertData: AlertData;
        diseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs;
        hazardTypes: Option[];
        suspectedDiseases: Option[];
    }): Promise<void> {
        const { alertData, diseaseOutbreakEvent, hazardTypes, suspectedDiseases } = options;

        const alertOptions: AlertOptions = {
            eventId: diseaseOutbreakEvent.id,
            dataSource: diseaseOutbreakEvent.dataSource,
            outbreakValue: alertData.outbreakData.value,
            incidentStatus: diseaseOutbreakEvent.incidentStatus,
        };

        await this.options.alertRepository
            .updateAlerts(alertOptions)
            .toPromise()
            .then(() => logger.success("Successfully updated alert."));

        return this.options.alertSyncRepository
            .saveAlertSyncData({
                alert: alertData.alert,
                dataSource: alertOptions.dataSource,
                outbreakValue: alertOptions.outbreakValue,
                nationalDiseaseOutbreakEventId: alertOptions.eventId,
                hazardTypes: hazardTypes,
                suspectedDiseases: suspectedDiseases,
            })
            .toPromise()
            .then(() => logger.success("Successfully saved alert sync data."));
    }
}

function getUniqueFilters(alerts: AlertData[]): OutbreakData[] {
    return _(alerts)
        .uniqBy(alertData => alertData.outbreakData.value)
        .map(alertData => alertData.outbreakData)
        .value();
}

const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";
