import { Future } from "../entities/generic/Future";
import { Option } from "../entities/Ref";
import { AlertOptions, AlertRepository } from "../repositories/AlertRepository";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";
import _ from "../entities/generic/Collection";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { logger } from "../../utils/logger";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { UserGroupRepository } from "../repositories/UserGroupRepository";
import { OutbreakAlert, OutbreakData } from "../entities/alert/OutbreakAlert";
import { OutbreakAlertRepository } from "../repositories/OutbreakAlertRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { getOutbreakKey } from "../entities/alert/AlertSynchronizationData";
import { promiseMap } from "../../utils/promiseMap";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";

export class MapAndSaveAlertsUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            outbreakAlertRepository: OutbreakAlertRepository;
            alertSyncRepository: AlertSyncRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            notificationRepository: NotificationRepository;
            userGroupRepository: UserGroupRepository;
            configurationsRepository: ConfigurationsRepository;
        }
    ) {}

    public async execute(): Promise<void> {
        const { suspectedDiseases } = await this.getOptions();
        const alertData = await this.options.outbreakAlertRepository.get().toPromise();

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

            return this.mapDiseaseOutbreakToAlertsAndSave(alerts, outbreakData, suspectedDiseases);
        });
    }

    private async mapDiseaseOutbreakToAlertsAndSave(
        alertData: OutbreakAlert[],
        outbreakData: OutbreakData,
        suspectedDiseases: Option[]
    ): Promise<void> {
        const diseaseOutbreakEvents = await this.getDiseaseOutbreakEvents(outbreakData);

        if (diseaseOutbreakEvents.length > 1) {
            const outbreakKey = getOutbreakKey({
                outbreakValue: outbreakData.value,
                suspectedDiseases: suspectedDiseases,
            });

            return logger.error(`More than 1 National event found for ${outbreakKey} outbreak.`);
        }

        const outbreakAlerts = alertData.filter(
            alertData => alertData.outbreakData.value === outbreakData.value
        );

        await promiseMap(outbreakAlerts, alertData => {
            return this.mapAndSaveAlertData(alertData, diseaseOutbreakEvents, suspectedDiseases);
        });
    }

    private getDiseaseOutbreakEvents(
        outbreakData: OutbreakData
    ): Promise<DiseaseOutbreakEventBaseAttrs[]> {
        return this.options.diseaseOutbreakEventRepository
            .getEventByDisease(outbreakData)
            .toPromise();
    }

    private getOptions(): Promise<{ suspectedDiseases: Option[] }> {
        const { configurationsRepository } = this.options;

        return configurationsRepository
            .getSelectableOptions()
            .flatMap(selectableOptions => {
                const { suspectedDiseases } = selectableOptions.eventTrackerConfigurations;

                return Future.success({
                    suspectedDiseases: suspectedDiseases,
                });
            })
            .toPromise();
    }

    private mapAndSaveAlertData(
        alertData: OutbreakAlert,
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[],
        suspectedDiseases: Option[]
    ): Promise<void> {
        const { outbreakData } = alertData;

        const outbreakType = outbreakData.type;
        const outbreakName = getOutbreakKey({
            outbreakValue: outbreakData.value,
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
            suspectedDiseases: suspectedDiseases,
        });
    }

    private async notifyNationalWatchStaff(
        alertData: OutbreakAlert,
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
        alertData: OutbreakAlert;
        diseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs;
        suspectedDiseases: Option[];
    }): Promise<void> {
        const { alertData, diseaseOutbreakEvent, suspectedDiseases } = options;

        const alertOptions: AlertOptions = {
            eventId: diseaseOutbreakEvent.id,
            outbreakValue: alertData.outbreakData.value,
        };

        await this.options.alertRepository
            .updateAlerts(alertOptions)
            .toPromise()
            .then(() => logger.success("Successfully updated alert."));

        return this.options.alertSyncRepository
            .saveAlertSyncData({
                alert: alertData.alert,
                outbreakValue: alertOptions.outbreakValue,
                nationalDiseaseOutbreakEventId: alertOptions.eventId,
                suspectedDiseases: suspectedDiseases,
            })
            .toPromise()
            .then(() => logger.success("Successfully saved alert sync data."));
    }
}

function getUniqueFilters(alerts: OutbreakAlert[]): OutbreakData[] {
    return _(alerts)
        .uniqBy(alertData => alertData.outbreakData.value)
        .map(alertData => alertData.outbreakData)
        .value();
}

const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";
