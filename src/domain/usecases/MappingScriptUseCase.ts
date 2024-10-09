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

export class MappingScriptUseCase {
    constructor(
        private alertRepository: AlertRepository,
        private alertDataRepository: AlertDataRepository,
        private alertSyncRepository: AlertSyncRepository,
        private diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository,
        private notificationRepository: NotificationRepository,
        private optionsRepository: OptionsRepository,
        private userGroupRepository: UserGroupRepository
    ) {}

    public async execute(): Promise<void> {
        const { hazardTypes, suspectedDiseases } = await this.getOptions();
        const alertData = await this.alertDataRepository.get().toPromise();

        logger.info(
            `${alertData.length} event(s) found in the Zebra Alerts program with no national event id.`
        );

        return _(alertData)
            .groupBy(alert => alert.dataSource)
            .values()
            .forEach(alertsByDataSource => {
                const uniqueFilters = getUniqueFilters(alertsByDataSource);

                return uniqueFilters.forEach(filter => {
                    this.getDiseaseOutbreakEvents({
                        id: filter.filterId,
                        value: filter.filterValue,
                    }).then(diseaseOutbreakEvents => {
                        this.handleAlertOutbreakMapping(
                            diseaseOutbreakEvents,
                            filter,
                            alertsByDataSource,
                            hazardTypes,
                            suspectedDiseases
                        );
                    });
                });
            });
    }

    private handleAlertOutbreakMapping(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[],
        filter: { filterId: string; filterValue: string; dataSource: DataSource },
        alertsByDataSource: AlertData[],
        hazardTypes: Option[],
        suspectedDiseases: Option[]
    ) {
        if (diseaseOutbreakEvents.length > 1) {
            const outbreakKey = getOutbreakKey({
                dataSource: filter.dataSource,
                outbreakValue: filter.filterValue,
                hazardTypes: hazardTypes,
                suspectedDiseases: suspectedDiseases,
            });

            logger.error(`More than 1 National event found for ${outbreakKey} outbreak.`);

            return undefined;
        }

        return alertsByDataSource
            .filter(alertData => alertData.outbreakData.value === filter.filterValue)
            .forEach(alertData => {
                this.processAlertData(
                    alertData,
                    diseaseOutbreakEvents,
                    hazardTypes,
                    suspectedDiseases
                );
            });
    }

    private getDiseaseOutbreakEvents(
        filter: OutbreakData
    ): Promise<DiseaseOutbreakEventBaseAttrs[]> {
        return this.diseaseOutbreakEventRepository
            .getEventByDiseaseOrHazardType(filter)
            .toPromise();
    }

    private getOptions(): Promise<{ hazardTypes: Option[]; suspectedDiseases: Option[] }> {
        return Future.joinObj({
            hazardTypes: this.optionsRepository.getHazardTypesByCode(),
            suspectedDiseases: this.optionsRepository.getSuspectedDiseases(),
        }).toPromise();
    }

    private processAlertData(
        alertData: AlertData,
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[],
        hazardTypes: Option[],
        suspectedDiseases: Option[]
    ): Promise<void> {
        const { dataSource, outbreakData } = alertData;

        const outbreakType =
            dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS ? "disease" : "hazard";
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
            throw new Error(
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
        logger.debug(`There is no national event with ${outbreakName} ${alertOutbreakType} type.`);

        const userGroup = await this.userGroupRepository
            .getUserGroupByCode(RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE)
            .toPromise();

        return this.notificationRepository
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

        await this.alertRepository
            .updateAlerts(alertOptions)
            .toPromise()
            .then(() => logger.success("Successfully updated alert."));

        return this.alertSyncRepository
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

function getUniqueFilters(alerts: AlertData[]): {
    filterId: string;
    filterValue: string;
    dataSource: DataSource;
}[] {
    return _(alerts)
        .uniqBy(filter => filter.outbreakData.value)
        .map(filter => ({
            filterId:
                filter.dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS
                    ? RTSL_ZEBRA_DISEASE_TEA_ID
                    : RTSL_ZEBRA_HAZARD_TEA_ID,
            filterValue: filter.outbreakData.value ?? "",
            dataSource: filter.dataSource,
        }))
        .value();
}

const RTSL_ZEBRA_DISEASE_TEA_ID = "jLvbkuvPdZ6";
const RTSL_ZEBRA_HAZARD_TEA_ID = "Dzrw3Tf0ukB";
const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";
