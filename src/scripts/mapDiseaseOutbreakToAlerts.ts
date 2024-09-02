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
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Maybe } from "../utils/ts-utils";
import { NotificationD2Repository } from "../data/repositories/NotificationD2Repository";
import { OptionsD2Repository } from "../data/repositories/OptionsD2Repository";
import { Future } from "../domain/entities/generic/Future";
import { getUserGroupsByCode } from "../data/repositories/utils/MetadataHelper";
import { NotifyWatchStaffUseCase } from "../domain/usecases/NotifyWatchStaffUseCase";
import {
    getOutbreakFromOptions,
    mapTrackedEntityAttributesToAlertOutbreak,
} from "../data/repositories/utils/AlertOutbreakMapper";
import { OutbreakType } from "../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

const RTSL_ZEBRA_DISEASE_TEA_ID = "jLvbkuvPdZ6";
const RTSL_ZEBRA_HAZARD_TEA_ID = "Dzrw3Tf0ukB";
const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_NATONAL_WATCH_STAFF";

type AlertData = {
    attribute: Maybe<Attribute>;
    trackedEntity: D2TrackerTrackedEntity;
    type: OutbreakType;
};

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
            const notificationRepository = new NotificationD2Repository(api);
            const optionsRepository = new OptionsD2Repository(api);

            const notifyWatchStaffUseCase = new NotifyWatchStaffUseCase(notificationRepository);

            return Future.joinObj({
                alertTrackedEntities: alertRepository.getTrackedEntitiesByTEACode({
                    program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    ouMode: "DESCENDANTS",
                }),
                hazardTypes: optionsRepository.getAllHazardTypes(),
                suspectedDiseases: optionsRepository.getAllSuspectedDiseases(),
            }).run(
                ({ alertTrackedEntities, hazardTypes, suspectedDiseases }) => {
                    const alertsWithNoEventId = _(alertTrackedEntities)
                        .compactMap(trackedEntity => {
                            const nationalEventId = alertRepository.getTEAttributeById(
                                trackedEntity,
                                RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
                            );
                            const hazardType = alertRepository.getTEAttributeById(
                                trackedEntity,
                                RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID
                            );
                            const diseaseType = alertRepository.getTEAttributeById(
                                trackedEntity,
                                RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID
                            );

                            const alertData: AlertData = {
                                trackedEntity: trackedEntity,
                                attribute: diseaseType ?? hazardType,
                                type: diseaseType ? "disease" : "hazard",
                            };

                            return !nationalEventId && (hazardType || diseaseType)
                                ? alertData
                                : undefined;
                        })
                        .value();

                    console.debug(
                        `There are ${alertsWithNoEventId.length} events in the Zebra Alerts program without event id`
                    );

                    return _(alertsWithNoEventId)
                        .groupBy(alert => alert.type)
                        .values()
                        .forEach(alertsByType => {
                            const uniqueFilters = getUniqueFilters(alertsByType);

                            return uniqueFilters.forEach(filter => {
                                alertRepository
                                    .getTrackedEntitiesByTEACode({
                                        program: RTSL_ZEBRA_PROGRAM_ID,
                                        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                                        ouMode: "SELECTED",
                                        filter: filter,
                                    })
                                    .run(
                                        nationalTrackedEntities => {
                                            if (nationalTrackedEntities.length > 1) {
                                                const outbreakName = getOutbreakFromOptions(
                                                    filter,
                                                    suspectedDiseases,
                                                    hazardTypes
                                                );

                                                console.error(
                                                    `More than 1 National TEI found for ${filter.type} type ${outbreakName}.`
                                                );

                                                return undefined;
                                            }

                                            return alertsByType
                                                .filter(
                                                    alertData =>
                                                        alertData.attribute?.value === filter.value
                                                )
                                                .forEach(alertData => {
                                                    const {
                                                        attribute,
                                                        trackedEntity: alertTrackedEntity,
                                                        type: alertOutbreakType,
                                                    } = alertData;

                                                    const outbreakName = getOutbreakFromOptions(
                                                        {
                                                            value: attribute?.value ?? "",
                                                            type: alertOutbreakType,
                                                        },
                                                        suspectedDiseases,
                                                        hazardTypes
                                                    );

                                                    if (!outbreakName) return undefined;

                                                    if (nationalTrackedEntities.length === 0) {
                                                        console.debug(
                                                            `There is no national event with ${outbreakName} ${alertOutbreakType} type`
                                                        );

                                                        return getUserGroupsByCode(
                                                            api,
                                                            RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE
                                                        ).run(
                                                            userGroups =>
                                                                notifyWatchStaffUseCase
                                                                    .execute(
                                                                        outbreakName,
                                                                        alertTrackedEntity,
                                                                        userGroups
                                                                    )
                                                                    .run(
                                                                        () =>
                                                                            console.debug(
                                                                                `Successfully notified all national watch staff.`
                                                                            ),
                                                                        error =>
                                                                            console.error(error)
                                                                    ),
                                                            error => console.error(error)
                                                        );
                                                    }

                                                    const nationalTrackedEntity =
                                                        nationalTrackedEntities[0];
                                                    if (!nationalTrackedEntity) return undefined;

                                                    const alertOutbreak =
                                                        mapTrackedEntityAttributesToAlertOutbreak(
                                                            nationalTrackedEntity,
                                                            alertTrackedEntity
                                                        );

                                                    alertRepository.updateAlerts(alertOutbreak).run(
                                                        () =>
                                                            console.debug(
                                                                "Successfully updated alert"
                                                            ),
                                                        error => console.error(error)
                                                    );

                                                    alertRepository
                                                        .saveAlertData({
                                                            nationalTrackedEntityEventId:
                                                                nationalTrackedEntity.trackedEntity ??
                                                                "",
                                                            outbreakKey: outbreakName,
                                                            outbreakType: alertOutbreakType,
                                                            trackedEntity: alertTrackedEntity,
                                                        })
                                                        .run(
                                                            () =>
                                                                console.debug(
                                                                    `Saved alert data for ${outbreakName} ${alertOutbreakType}`
                                                                ),
                                                            error => {
                                                                console.error(error);
                                                                console.error(
                                                                    `Error saving alert data for ${outbreakName} ${alertOutbreakType}`
                                                                );
                                                            }
                                                        );
                                                });
                                        },
                                        error => console.error(error)
                                    );
                            });
                        });
                },
                error => console.error(error)
            );
        },
    });

    run(cmd, process.argv.slice(2));
}

function getUniqueFilters(alertsByType: AlertData[]): {
    id: string;
    value: string;
    type: OutbreakType;
}[] {
    return _(alertsByType)
        .uniqBy(filter => filter.attribute?.value)
        .map(filter => ({
            id: filter.type === "disease" ? RTSL_ZEBRA_DISEASE_TEA_ID : RTSL_ZEBRA_HAZARD_TEA_ID,
            value: filter.attribute?.value ?? "",
            type: filter.type,
        }))
        .value();
}

main();
