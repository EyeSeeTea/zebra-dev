import { command, run } from "cmd-ts";
import path from "path";
import { getD2ApiFromArgs } from "./common";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "../data/repositories/consts/DiseaseOutbreakConstants";
import _ from "../domain/entities/generic/Collection";
import { AlertD2Repository } from "../data/repositories/AlertD2Repository";
import { NotificationD2Repository } from "../data/repositories/NotificationD2Repository";
import { Future } from "../domain/entities/generic/Future";
import { getTEAttributeById, getUserGroupByCode } from "../data/repositories/utils/MetadataHelper";
import { NotifyWatchStaffUseCase } from "../domain/usecases/NotifyWatchStaffUseCase";
import {
    getOutbreakKey,
    mapTrackedEntityAttributesToAlertOptions,
} from "../data/repositories/utils/AlertOutbreakMapper";
import { AlertSyncDataStoreRepository } from "../data/repositories/AlertSyncDataStoreRepository";
import { getNotificationOptionsFromTrackedEntity } from "../data/repositories/utils/NotificationMapper";
import { AlertData } from "../domain/entities/alert/AlertData";
import { DataSource } from "../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { FutureData } from "../data/api-futures";
import { Alert } from "../domain/entities/alert/Alert";
import { AlertOptions } from "../domain/repositories/AlertRepository";
import { Option } from "../domain/entities/Ref";
import { ConfigurationsD2Repository } from "../data/repositories/ConfigurationsD2Repository";

//TO DO : Fetch from metadata on app load
const RTSL_ZEBRA_DISEASE_TEA_ID = "jLvbkuvPdZ6";
const RTSL_ZEBRA_HAZARD_TEA_ID = "Dzrw3Tf0ukB";
const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Map national event ID to Zebra Alert Events with no event ID",
        args: {},
        handler: async () => {
            if (!process.env.VITE_DHIS2_BASE_URL)
                throw new Error("VITE_DHIS2_BASE_URL must be set in the .env file");

            if (!process.env.VITE_DHIS2_AUTH)
                throw new Error("VITE_DHIS2_AUTH must be set in the .env file");

            const username = process.env.VITE_DHIS2_AUTH.split(":")[0] ?? "";
            const password = process.env.VITE_DHIS2_AUTH.split(":")[1] ?? "";

            if (username === "" || password === "") {
                throw new Error("VITE_DHIS2_AUTH must be in the format 'username:password'");
            }

            const envVars = {
                url: process.env.VITE_DHIS2_BASE_URL,
                auth: {
                    username: username,
                    password: password,
                },
            };

            const api = getD2ApiFromArgs(envVars);
            const alertRepository = new AlertD2Repository(api);
            const alertSyncRepository = new AlertSyncDataStoreRepository(api);
            const notificationRepository = new NotificationD2Repository(api);
            const configurationsRepository = new ConfigurationsD2Repository(api);
            const notifyWatchStaffUseCase = new NotifyWatchStaffUseCase(notificationRepository);

            return Future.joinObj({
                alertTrackedEntities: getAlertTrackedEntities(),
                appConfig: configurationsRepository.getSelectableOptions(),
            }).run(
                ({ alertTrackedEntities, appConfig }) => {
                    const { hazardTypes, suspectedDiseases } = appConfig.eventTrackerConfigurations;
                    const alertsWithNoEventId =
                        getAlertsWithNoNationalEventId(alertTrackedEntities);

                    console.debug(
                        `${alertsWithNoEventId.length} event(s) found in the Zebra Alerts program with no national event id.`
                    );

                    return _(alertsWithNoEventId)
                        .groupBy(alert => alert.dataSource)
                        .values()
                        .forEach(alertsByDataSource => {
                            const uniqueFilters = getUniqueFilters(alertsByDataSource);

                            return uniqueFilters.forEach(filter =>
                                getNationalTrackedEntities({
                                    id: filter.filterId,
                                    value: filter.filterValue,
                                }).run(
                                    nationalTrackedEntities => {
                                        if (nationalTrackedEntities.length > 1) {
                                            const outbreakKey = getOutbreakKey({
                                                dataSource: filter.dataSource,
                                                outbreakValue: filter.filterValue,
                                                hazardTypes: hazardTypes,
                                                suspectedDiseases: suspectedDiseases,
                                            });

                                            console.error(
                                                `More than 1 National event found for ${outbreakKey} outbreak.`
                                            );

                                            return undefined;
                                        }

                                        return alertsByDataSource
                                            .filter(
                                                alertData =>
                                                    alertData.outbreakData.value ===
                                                    filter.filterValue
                                            )
                                            .forEach(alertData => {
                                                const { alert, dataSource, outbreakData } =
                                                    alertData;

                                                const outbreakType =
                                                    dataSource ===
                                                    DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS
                                                        ? "disease"
                                                        : "hazard";
                                                const outbreakName = getOutbreakKey({
                                                    dataSource: dataSource,
                                                    outbreakValue: outbreakData.value,
                                                    hazardTypes: hazardTypes,
                                                    suspectedDiseases: suspectedDiseases,
                                                });

                                                alertSyncRepository
                                                    .getAlertTrackedEntity(alert)
                                                    .run(
                                                        alertTrackedEntity => {
                                                            if (
                                                                nationalTrackedEntities.length === 0
                                                            ) {
                                                                return notifyNationalWatchStaff(
                                                                    alertTrackedEntity,
                                                                    outbreakType,
                                                                    outbreakName
                                                                ).run(
                                                                    () =>
                                                                        console.debug(
                                                                            "Successfully notified all national watch staff."
                                                                        ),
                                                                    error => console.error(error)
                                                                );
                                                            }

                                                            const nationalTrackedEntity =
                                                                nationalTrackedEntities[0];
                                                            if (!nationalTrackedEntity)
                                                                throw new Error(
                                                                    `No tracked entity found.`
                                                                );

                                                            const alertOptions =
                                                                mapTrackedEntityAttributesToAlertOptions(
                                                                    nationalTrackedEntity,
                                                                    alertTrackedEntity
                                                                );

                                                            alertRepository
                                                                .updateAlerts(alertOptions)
                                                                .run(
                                                                    () =>
                                                                        console.debug(
                                                                            "Successfully updated alert."
                                                                        ),
                                                                    error => console.error(error)
                                                                );

                                                            saveAlertSyncData({
                                                                alertOptions: alertOptions,
                                                                alert: alert,
                                                                hazardTypes: hazardTypes,
                                                                suspectedDiseases:
                                                                    suspectedDiseases,
                                                            }).run(
                                                                () =>
                                                                    console.debug(
                                                                        `Saved alert data for ${outbreakName} ${outbreakType}.`
                                                                    ),
                                                                error => console.error(error)
                                                            );
                                                        },
                                                        error => console.error(error)
                                                    );
                                            });
                                    },
                                    error => console.error(error)
                                )
                            );
                        });
                },
                error => console.error(error)
            );

            function getAlertTrackedEntities(): FutureData<D2TrackerTrackedEntity[]> {
                return alertRepository.getTrackedEntitiesByTEACode({
                    program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    ouMode: "DESCENDANTS",
                });
            }

            function getAlertsWithNoNationalEventId(
                alertTrackedEntities: D2TrackerTrackedEntity[]
            ): AlertData[] {
                return _(alertTrackedEntities)
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
                        };

                        return !nationalEventId && (hazardType || diseaseType)
                            ? alertData
                            : undefined;
                    })
                    .value();
            }

            function getNationalTrackedEntities(filter: {
                id: string;
                value: string;
            }): FutureData<D2TrackerTrackedEntity[]> {
                return alertRepository.getTrackedEntitiesByTEACode({
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    ouMode: "SELECTED",
                    filter: filter,
                });
            }

            function notifyNationalWatchStaff(
                alertTrackedEntity: D2TrackerTrackedEntity,
                alertOutbreakType: string,
                outbreakName: string
            ): FutureData<void> {
                console.debug(
                    `There is no national event with ${outbreakName} ${alertOutbreakType} type.`
                );

                return getUserGroupByCode(
                    api,
                    RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE
                ).flatMap(userGroup => {
                    const notificationOptions =
                        getNotificationOptionsFromTrackedEntity(alertTrackedEntity);

                    return notifyWatchStaffUseCase.execute(outbreakName, notificationOptions, [
                        userGroup,
                    ]);
                });
            }

            function saveAlertSyncData(options: {
                alertOptions: AlertOptions;
                alert: Alert;
                hazardTypes: Option[];
                suspectedDiseases: Option[];
            }) {
                const { alert, alertOptions, hazardTypes, suspectedDiseases } = options;
                const { dataSource, eventId, hazardTypeCode, suspectedDiseaseCode } = alertOptions;

                return alertSyncRepository.saveAlertSyncData({
                    dataSource: dataSource,
                    hazardTypeCode: hazardTypeCode,
                    suspectedDiseaseCode: suspectedDiseaseCode,
                    nationalDiseaseOutbreakEventId: eventId,
                    alert: alert,
                    hazardTypes: hazardTypes,
                    suspectedDiseases: suspectedDiseases,
                });
            }
        },
    });

    run(cmd, process.argv.slice(2));
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

main();
