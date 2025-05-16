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
import { getOutbreakKey } from "../entities/AlertsAndCaseForCasesData";
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
            selectableOptions: this.getOptions(),
        }).flatMap(({ alertData, selectableOptions }) => {
            handleAsyncLogging(
                logger.info(
                    `${alertData.length} event(s) found in the Zebra Alerts program with no national event id.`
                )
            );
            const alertsByDisease = getAlertsByDisease(alertData);

            return Future.sequential(
                alertsByDisease.map(diseaseAlerts => {
                    const { outbreakData, alerts } = diseaseAlerts;
                    return this.mapDiseaseOutbreakToAlertsAndSave(
                        alerts,
                        outbreakData,
                        selectableOptions.suspectedDiseases
                    );
                })
            ).flatMap(() => Future.success(undefined));
        });
    }

    private mapDiseaseOutbreakToAlertsAndSave(
        alertData: OutbreakAlert[],
        outbreakData: OutbreakData,
        suspectedDiseases: Option[]
    ): FutureData<void> {
        return this.getDiseaseOutbreakEvents(outbreakData).flatMap(diseaseOutbreakEvents => {
            const outbreakKey = getOutbreakKey({
                outbreakValue: outbreakData.value,
                suspectedDiseases: suspectedDiseases,
            });

            if (diseaseOutbreakEvents.length > 1) {
                return handleAsyncLogging(
                    logger.error(`More than 1 National event found for ${outbreakKey} outbreak.`)
                );
            }

            return this.mapAndSaveAlertData({
                alertData: alertData,
                diseaseOutbreakEvents: diseaseOutbreakEvents,
                outbreakKey: outbreakKey,
            });
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
        alertData: OutbreakAlert[];
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[];
        outbreakKey: string;
    }): FutureData<void> {
        const { alertData, diseaseOutbreakEvents, outbreakKey } = options;

        if (diseaseOutbreakEvents.length === 0) {
            return Future.sequential(
                alertData.map(outbreakAlert => {
                    return this.notifyNationalWatchStaff(outbreakAlert, outbreakKey);
                })
            ).flatMap(() => Future.success(undefined));
        }

        const diseaseOutbreakEvent = diseaseOutbreakEvents[0];
        if (!diseaseOutbreakEvent)
            return handleAsyncLogging(
                logger.error(`No disease outbreak event found for ${outbreakKey} disease type.`)
            );

        return this.updateAlertData({
            diseaseOutbreakEvent: diseaseOutbreakEvent,
            outbreakKey: outbreakKey,
        });
    }

    private notifyNationalWatchStaff(
        alertData: OutbreakAlert,
        outbreakKey: string
    ): FutureData<void> {
        return Future.joinObj({
            logMissingNationalDisease: handleAsyncLogging(
                logger.debug(`There is no national event with ${outbreakKey} disease type.`)
            ),
            nationalWatchStaffUserGroup: this.options.userGroupRepository.getUserGroupByCode(
                RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE
            ),
        }).flatMap(({ nationalWatchStaffUserGroup }) =>
            this.options.notificationRepository.notifyNationalWatchStaff(alertData, outbreakKey, [
                nationalWatchStaffUserGroup,
            ])
        );
    }

    private updateAlertData(options: {
        diseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs;
        outbreakKey: string;
    }): FutureData<void> {
        const { diseaseOutbreakEvent, outbreakKey } = options;

        return this.options.alertRepository
            .updateAlerts({
                eventId: diseaseOutbreakEvent.id,
                outbreakValue: diseaseOutbreakEvent.suspectedDiseaseCode,
            })
            .flatMap(alerts => {
                if (alerts.length === 0) return Future.success(undefined);
                return handleAsyncLogging(
                    logger.success(`Successfully updated ${alerts.length} active verified alerts.`)
                ).flatMap(() => {
                    return Future.sequential(
                        alerts.map(alert => {
                            return this.options.alertSyncRepository.saveAlertSyncData({
                                alert: alert,
                                nationalDiseaseOutbreakEventId: diseaseOutbreakEvent.id,
                                outbreakKey: outbreakKey,
                            });
                        })
                    ).flatMap(() =>
                        handleAsyncLogging(logger.success("Successfully saved alert sync data."))
                    );
                });
            });
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
                .map(alertData => ({
                    outbreakData: alertData.outbreakData,
                    alerts: alertsByDisease,
                }))
                .value();
        });
}

const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";
