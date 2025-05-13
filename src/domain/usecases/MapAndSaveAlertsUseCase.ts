import { Future } from "../entities/generic/Future";
import { Option } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
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
import { FutureData } from "../../data/api-futures";
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

    public execute(): FutureData<void> {
        return Future.joinObj({
            alertData: this.options.outbreakAlertRepository.get(),
        }).flatMap(({ alertData }) => {
            handleAsyncLogging(
                logger.info(
                    `${alertData.length} event(s) found in the Zebra Alerts program with no national event id.`
                )
            );
            const alertsByDisease = getAlertsByDisease(alertData);

            return Future.sequential(
                alertsByDisease.map(diseaseAlerts => {
                    const { outbreakData, alerts } = diseaseAlerts;
                    return this.mapDiseaseOutbreakToAlertsAndSave(alerts, outbreakData);
                })
            ).flatMap(() => Future.success(undefined));
        });
    }

    private mapDiseaseOutbreakToAlertsAndSave(
        alertData: OutbreakAlert[],
        outbreakData: OutbreakData
    ): FutureData<void> {
        return Future.joinObj({
            diseaseOutbreakEvents: this.getDiseaseOutbreakEvents(outbreakData),
            selectableOptions: this.getOptions(),
        }).flatMap(({ diseaseOutbreakEvents, selectableOptions }) => {
            const { suspectedDiseases } = selectableOptions;
            const outbreakKey = getOutbreakKey({
                outbreakValue: outbreakData.value,
                suspectedDiseases: suspectedDiseases,
            });

            if (diseaseOutbreakEvents.length > 1) {
                return handleAsyncLogging(
                    logger.error(`More than 1 National event found for ${outbreakKey} outbreak.`)
                );
            }

            const outbreakAlerts = alertData.filter(
                alertData => alertData.outbreakData.value === outbreakData.value
            );

            return Future.sequential(
                outbreakAlerts.map(alertData =>
                    this.mapAndSaveAlertData({
                        alertData: alertData,
                        diseaseOutbreakEvents: diseaseOutbreakEvents,
                        outbreakName: outbreakKey,
                        suspectedDiseases: suspectedDiseases,
                    })
                )
            ).flatMap(() => Future.success(undefined));
        });
    }

    private getDiseaseOutbreakEvents(
        outbreakData: OutbreakData
    ): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return this.options.diseaseOutbreakEventRepository.getEventByDisease(outbreakData);
    }

    private getOptions(): FutureData<{ suspectedDiseases: Option[] }> {
        const { configurationsRepository } = this.options;

        return configurationsRepository.getSelectableOptions().flatMap(selectableOptions => {
            const { suspectedDiseases } = selectableOptions.eventTrackerConfigurations;

            return Future.success({
                suspectedDiseases: suspectedDiseases,
            });
        });
    }

    private mapAndSaveAlertData(options: {
        alertData: OutbreakAlert;
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[];
        outbreakName: string;
        suspectedDiseases: Option[];
    }): FutureData<void> {
        const { alertData, diseaseOutbreakEvents, outbreakName, suspectedDiseases } = options;

        if (diseaseOutbreakEvents.length === 0) {
            // 3.1. Loop by each alert: first notifyNationalWatchStaff if there is no Zebra national event for that disease.
            return this.notifyNationalWatchStaff(alertData, outbreakName);
        }

        const diseaseOutbreakEvent = diseaseOutbreakEvents[0];
        if (!diseaseOutbreakEvent)
            return handleAsyncLogging(
                logger.error(
                    `No disease outbreak event found for ${outbreakName} type ${outbreakName}.`
                )
            );

        return this.updateAlertData({
            diseaseOutbreakEvent: diseaseOutbreakEvent,
            outbreakData: alertData.outbreakData,
            suspectedDiseases: suspectedDiseases,
        });
    }

    private notifyNationalWatchStaff(
        alertData: OutbreakAlert,
        outbreakName: string
    ): FutureData<void> {
        return Future.joinObj({
            logMissingNationalDisease: handleAsyncLogging(
                logger.debug(`There is no national event with ${outbreakName} disease type.`)
            ),
            nationalWatchStaffUserGroup: this.options.userGroupRepository.getUserGroupByCode(
                RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE
            ),
        }).flatMap(({ nationalWatchStaffUserGroup }) =>
            this.options.notificationRepository
                .notifyNationalWatchStaff(alertData, outbreakName, [nationalWatchStaffUserGroup])
                .flatMap(() => Future.success(undefined))
        );
    }

    private updateAlertData(options: {
        diseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs;
        outbreakData: OutbreakData;
        suspectedDiseases: Option[];
    }): FutureData<void> {
        const { diseaseOutbreakEvent, outbreakData, suspectedDiseases } = options;

        return this.options.alertRepository
            .updateAlerts({
                eventId: diseaseOutbreakEvent.id,
                outbreakValue: outbreakData.value,
            })
            .flatMap(alerts => {
                return handleAsyncLogging(logger.success("Successfully updated alert."))
                    .flatMap(() => {
                        return Future.sequential(
                            alerts.map(alert =>
                                this.options.alertSyncRepository.saveAlertSyncData({
                                    alert: alert,
                                    nationalDiseaseOutbreakEventId: diseaseOutbreakEvent.id,
                                    outbreakValue: outbreakData.value,
                                    suspectedDiseases: suspectedDiseases,
                                })
                            )
                        ).flatMap(() =>
                            handleAsyncLogging(
                                logger.success("Successfully saved alert sync data.")
                            )
                        );
                    })
                    .flatMap(() => Future.success(undefined));
            })
            .flatMap(() => Future.success(undefined));
    }
}

const handleAsyncLogging = (logger: Promise<void>): FutureData<void> => {
    return Future.fromPromise(logger).flatMap(() => Future.success(undefined));
};

function getAlertsByDisease(alerts: OutbreakAlert[]) {
    return _(alerts)
        .groupBy(alert => alert.outbreakData.value)
        .values()
        .flatMap(alertsByDisease => {
            return _(alertsByDisease)
                .uniqBy(alertData => alertData.outbreakData.value)
                .map(alertData => ({ outbreakData: alertData.outbreakData, alerts: alerts }))
                .value();
        });
}

const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";
