import { Future } from "../entities/generic/Future";
import { Code, Id, Option } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";
import _ from "../entities/generic/Collection";
import { logger } from "../../utils/logger";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { UserGroupRepository } from "../repositories/UserGroupRepository";
import { OutbreakAlert, UNKNOWN_DISEASE_CODE } from "../entities/alert/OutbreakAlert";
import { OutbreakAlertRepository } from "../repositories/OutbreakAlertRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { getOutbreakKey } from "../entities/AlertsAndCaseForCasesData";
import { FutureData } from "../../data/api-futures";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";
import { HashMap } from "../entities/generic/HashMap";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";

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
        // 1. Update all alerts from the Zebra Alerts program that have no confirmed disease already set
        handleAsyncLogging(
            logger.info(
                `[${new Date().toISOString()}] Updating all alerts from the Zebra Alerts program that have no confirmed disease already set.`
            )
        );
        return this.options.outbreakAlertRepository.updateConfirmedDiseaseInAlerts().flatMap(() => {
            // 2. Get all outbreak alerts that have no disease outbreak event id but have a confirmed disease
            return Future.joinObj({
                outbreakAlertsWithoutNationalId:
                    this.options.outbreakAlertRepository.getOutbreakAlertsWithoutNationalId(),
                selectableOptions: this.getOptions(),
            }).flatMap(({ outbreakAlertsWithoutNationalId, selectableOptions }) => {
                handleAsyncLogging(
                    logger.info(
                        `[${new Date().toISOString()}] Updating all alerts from the Zebra Alerts program that have no national Event ID. ${
                            outbreakAlertsWithoutNationalId.length
                        } event(s) found in the Zebra Alerts program with no national Event ID.`
                    )
                );
                const alertsByDisease = getOutbreakAlertsByConfirmedDisease(
                    outbreakAlertsWithoutNationalId
                );

                return Future.sequential(
                    // 3. For each confirmed disease, add in active verified alerts with PHEOC status Respond the corresponding disease outbreak event id
                    // and save alerts sync data in datastore
                    alertsByDisease.toPairs().map(([confirmedDiseaseCode, outbreakAlerts]) => {
                        if (
                            !confirmedDiseaseCode ||
                            confirmedDiseaseCode === UNKNOWN_DISEASE_CODE
                        ) {
                            return Future.success(undefined);
                        }

                        return this.mapDiseaseOutbreakEventIdAndSaveAlertData(
                            confirmedDiseaseCode,
                            outbreakAlerts,
                            selectableOptions.suspectedDiseases
                        );
                    })
                ).flatMap(() => Future.success(undefined));
            });
        });
    }

    private mapDiseaseOutbreakEventIdAndSaveAlertData(
        confirmedDiseaseCode: Code,
        alertData: OutbreakAlert[],
        diseaseOptions: Option[]
    ): FutureData<void> {
        return this.options.diseaseOutbreakEventRepository
            .getAllActiveByDisease(confirmedDiseaseCode)
            .flatMap(diseaseOutbreakEvents => {
                const outbreakKey = getOutbreakKey({
                    diseaseCode: confirmedDiseaseCode,
                    diseaseOptions: diseaseOptions,
                });

                if (diseaseOutbreakEvents.length > 1) {
                    return handleAsyncLogging(
                        logger.error(
                            `[${new Date().toISOString()}] More than 1 National event found for ${outbreakKey} outbreak.`
                        )
                    );
                }

                if (diseaseOutbreakEvents.length === 0) {
                    handleAsyncLogging(
                        logger.debug(
                            `[${new Date().toISOString()}] There is no national event with ${outbreakKey} disease type.`
                        )
                    );
                    return Future.sequential(
                        alertData.map(outbreakAlert => {
                            return this.notifyNationalWatchStaff(outbreakAlert, outbreakKey);
                        })
                    ).flatMap(() => Future.success(undefined));
                }

                const diseaseOutbreakEvent = diseaseOutbreakEvents[0];
                if (!diseaseOutbreakEvent)
                    return handleAsyncLogging(
                        logger.error(
                            `[${new Date().toISOString()}] No disease outbreak event found for ${outbreakKey} disease type.`
                        )
                    );

                return this.updateRespondAlertsWithDiseaseOutbreakEventId({
                    diseaseOutbreakEventId: diseaseOutbreakEvent.id,
                    diseaseOutbreakEventDiseaseCode: diseaseOutbreakEvent.suspectedDiseaseCode,
                    outbreakKey: outbreakKey,
                });
            });
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

    private notifyNationalWatchStaff(
        alertData: OutbreakAlert,
        outbreakKey: string
    ): FutureData<void> {
        return this.options.userGroupRepository
            .getUserGroupByCode(RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE)
            .flatMap(nationalWatchStaffUserGroup =>
                this.options.notificationRepository.notifyNationalWatchStaff(
                    alertData,
                    outbreakKey,
                    [nationalWatchStaffUserGroup]
                )
            );
    }

    private updateRespondAlertsWithDiseaseOutbreakEventId(options: {
        diseaseOutbreakEventId: Id;
        diseaseOutbreakEventDiseaseCode: Maybe<Code>;
        outbreakKey: string;
    }): FutureData<void> {
        const { diseaseOutbreakEventId, diseaseOutbreakEventDiseaseCode, outbreakKey } = options;

        return this.options.alertRepository
            .updateActiveVerifiedRespondAlerts({
                diseaseOutbreakEventId: diseaseOutbreakEventId,
                diseaseCode: diseaseOutbreakEventDiseaseCode,
            })
            .flatMap(alerts => {
                if (alerts.length === 0) {
                    return handleAsyncLogging(
                        logger.info(
                            `[${new Date().toISOString()}] No active verified alerts found for disease outbreak id ${diseaseOutbreakEventId} (disease ${diseaseOutbreakEventDiseaseCode}) with Respond PHEOC status from the Zebra Alerts program`
                        )
                    );
                } else {
                    return handleAsyncLogging(
                        logger.info(
                            `[${new Date().toISOString()}] Disease outbreak id ${diseaseOutbreakEventId} (disease ${diseaseOutbreakEventDiseaseCode}) added in ${
                                alerts.length
                            } active verified alerts(s) with Respond PHEOC status from the Zebra Alerts program`
                        )
                    ).flatMap(() => {
                        return this.saveAlertsSyncData(diseaseOutbreakEventId, outbreakKey, alerts);
                    });
                }
            });
    }

    private saveAlertsSyncData(
        diseaseOutbreakEventId: Id,
        outbreakKey: string,
        alerts: Alert[]
    ): FutureData<void> {
        if (alerts.length === 0) return Future.success(undefined);

        return handleAsyncLogging(
            logger.success(
                `[${new Date().toISOString()}] Successfully updated ${
                    alerts.length
                } active verified alerts.`
            )
        ).flatMap(() => {
            return Future.sequential(
                alerts.map(alert => {
                    return this.options.alertSyncRepository.saveAlertSyncData({
                        alert: alert,
                        nationalDiseaseOutbreakEventId: diseaseOutbreakEventId,
                        outbreakKey: outbreakKey,
                    });
                })
            ).flatMap(() =>
                handleAsyncLogging(
                    logger.success(
                        `[${new Date().toISOString()}] Successfully saved alert sync data.`
                    )
                )
            );
        });
    }
}

const handleAsyncLogging = (logger: Promise<void>): FutureData<void> => {
    return Future.fromPromise(logger).flatMap(() => Future.success(undefined));
};

function getOutbreakAlertsByConfirmedDisease(
    outbreakAlerts: OutbreakAlert[]
): HashMap<Maybe<string>, OutbreakAlert[]> {
    const groupedByConfirmedDisease = _(outbreakAlerts)
        .groupBy(outbreakAlert => outbreakAlert.alert.confirmedDiseaseCode)
        .omitBy(([key, _value]) => key === null || key === undefined || key === "");

    return groupedByConfirmedDisease;
}

const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";
