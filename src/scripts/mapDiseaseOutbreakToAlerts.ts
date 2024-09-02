import { command, run } from "cmd-ts";
import path from "path";
import { getD2ApiFromArgs } from "./common";
import {
    diseaseOutbreakCodes,
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "../data/repositories/consts/DiseaseOutbreakConstants";
import _ from "../domain/entities/generic/Collection";
import { AlertD2Repository } from "../data/repositories/AlertD2Repository";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DataSource,
    IncidentStatusType,
} from "../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { AlertOptions } from "../domain/repositories/AlertRepository";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import { Maybe } from "../utils/ts-utils";
import { NotificationD2Repository } from "../data/repositories/NotificationD2Repository";
import { OptionsD2Repository } from "../data/repositories/OptionsD2Repository";
import { Future } from "../domain/entities/generic/Future";
import { Option } from "/Users/deeonwuli-est/Documents/zebra-dev/src/domain/entities/Ref";
import { getUserGroupsByCode } from "../data/repositories/utils/MetadataHelper";

const RTSL_ZEBRA_DISEASE_TEA_ID = "jLvbkuvPdZ6";
const RTSL_ZEBRA_HAZARD_TEA_ID = "Dzrw3Tf0ukB";
const RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE = "RTSL_ZEBRA_ADMIN";
//1. update the datastore with the last sync time for that disease
//2. what are all the districts mapped to that national events
//3. what are the cases, deaths and number of districts for each of these
// notification triggered when a new event has been created since the last time (2 hours) if it is a verified event

// fetch program stage to get cases, deaths
// alert id is tei id of the particular event

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

                            if (!nationalEventId && (hazardType || diseaseType)) {
                                if (diseaseType) {
                                    return {
                                        ...trackedEntity,
                                        ...diseaseType,
                                        type: "DISEASE",
                                    };
                                } else if (hazardType) {
                                    return {
                                        ...trackedEntity,
                                        ...hazardType,
                                        type: "HAZARD",
                                    };
                                }
                            }
                            return undefined;
                        })
                        .value();

                    console.debug(
                        `There are ${alertsWithNoEventId.length} events in the Zebra Alerts program without event id`
                    );

                    const synchronizationData = [];

                    return _(alertsWithNoEventId)
                        .groupBy(alert => alert.type)
                        .values()
                        .forEach(alertsByType => {
                            const uniqueFilters = _(alertsByType)
                                .uniqBy(filter => filter.value)
                                .map(filter => ({
                                    id:
                                        filter.type === "DISEASE"
                                            ? RTSL_ZEBRA_DISEASE_TEA_ID
                                            : RTSL_ZEBRA_HAZARD_TEA_ID,
                                    value: filter.value,
                                    type: filter.type,
                                }))
                                .value();

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
                                                const outbreak = getOutbreakFromOptions(
                                                    filter,
                                                    suspectedDiseases,
                                                    hazardTypes
                                                );

                                                console.error(
                                                    `More than 1 National TEI found for ${filter.type.toLocaleLowerCase()} type ${outbreak}`
                                                );

                                                return undefined;
                                            }

                                            return alertsByType
                                                .filter(alert => alert.value === filter.value)
                                                .forEach(alertTrackedEntity => {
                                                    if (nationalTrackedEntities.length === 0) {
                                                        const outbreak = getOutbreakFromOptions(
                                                            alertTrackedEntity,
                                                            suspectedDiseases,
                                                            hazardTypes
                                                        );

                                                        console.debug(
                                                            `There is no national event with ${outbreak} ${alertTrackedEntity.type.toLocaleLowerCase()} type`
                                                        );

                                                        return getUserGroupsByCode(
                                                            api,
                                                            RTSL_ZEBRA_NATIONAL_WATCH_STAFF_USER_GROUP_CODE
                                                        ).run(
                                                            userGroups => {
                                                                notificationRepository
                                                                    .save({
                                                                        subject: `New Outbreak Alert: ${outbreak} in zm Zambia Ministry of Health`,
                                                                        text: buildOutbreakNotification(
                                                                            alertTrackedEntity,
                                                                            outbreak
                                                                        ),
                                                                        userGroups: userGroups,
                                                                    })
                                                                    .run(
                                                                        () =>
                                                                            console.debug(
                                                                                `Successfully notified all national watch staff.`
                                                                            ),
                                                                        error =>
                                                                            console.error(error)
                                                                    );
                                                            },
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

                                                    const verificationStatus = getValueFromMap(
                                                        "verificationStatus",
                                                        alertTrackedEntity
                                                    );

                                                    if (verificationStatus === "VERIFIED") {
                                                        const dataValues =
                                                            alertTrackedEntity.enrollments
                                                                ? alertTrackedEntity.enrollments[0]
                                                                      ?.events[0]?.dataValues // for each event
                                                                : [];

                                                        const alertData = {
                                                            type: alertTrackedEntity.type,
                                                            alertId:
                                                                alertTrackedEntity.trackedEntity, // event id
                                                            // eventDate: event.reportDate,
                                                            orgUnit: alertTrackedEntity.orgUnit,
                                                            "Suspected Cases": getDataValueFromMap(
                                                                "Suspected Cases",
                                                                dataValues
                                                            ),
                                                            "Probable Cases": getDataValueFromMap(
                                                                "Probable Cases",
                                                                dataValues
                                                            ),
                                                            "Confirmed Cases": getDataValueFromMap(
                                                                "Confirmed Cases",
                                                                dataValues
                                                            ),
                                                            Deaths: getDataValueFromMap(
                                                                "Deaths",
                                                                dataValues
                                                            ),
                                                        };

                                                        synchronizationData.push(alertData);
                                                    }
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

function getOutbreakFromOptions(
    filter: { value: string; type: string },
    suspectedDiseases: Option[],
    hazardTypes: Option[]
): string {
    return (
        (filter.type === "DISEASE"
            ? suspectedDiseases.find(disease => disease.id === filter.value)?.name
            : hazardTypes.find(hazardType => hazardType.id === filter.value)?.name) ?? filter.value
    );
}

function buildOutbreakNotification(
    alertTrackedEntity: D2TrackerTrackedEntity,
    outbreak: string
): string {
    const verificationStatus = getValueFromMap("verificationStatus", alertTrackedEntity);
    const incidentManager = getValueFromMap("incidentManager", alertTrackedEntity);
    const emergenceDate = getValueFromMap("emergedDate", alertTrackedEntity);
    const detectionDate = getValueFromMap("detectedDate", alertTrackedEntity);
    const notificationDate = getValueFromMap("notifiedDate", alertTrackedEntity);
    // ? i18n
    return `There has been a new Outbreak detected for ${outbreak} in zm Zambia Ministry of Health.

Please see the details of the outbreak below:

Emergence date: ${emergenceDate}
Detection Date :  ${detectionDate}
Notification Date :  ${notificationDate}
Incident Manager :  ${incidentManager}
Verification Status :  ${verificationStatus}`;
}

function mapTrackedEntityAttributesToAlertOutbreak(
    nationalTrackedEntity: D2TrackerTrackedEntity,
    alertTrackedEntity: D2TrackerTrackedEntity
): AlertOptions {
    if (!nationalTrackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: AlertOptions = {
        eventId: nationalTrackedEntity.trackedEntity,
        dataSource: getValueFromMap("dataSource", nationalTrackedEntity) as DataSource,
        hazardTypeCode: getValueFromMap("hazardType", alertTrackedEntity),
        suspectedDiseaseCode: getValueFromMap("suspectedDisease", alertTrackedEntity),
        incidentStatus: getValueFromMap(
            "incidentStatus",
            nationalTrackedEntity
        ) as IncidentStatusType,
    };

    return diseaseOutbreak;
}

function getValueFromMap(
    key: keyof typeof alertOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === alertOutbreakCodes[key])?.value ?? "";
}

function getDataValueFromMap(
    key: keyof typeof dataElementIds,
    dataValues: Maybe<DataValue[]>
): string {
    if (!dataValues) return "";

    return dataValues.find(dataValue => dataValue.dataElement === dataElementIds[key])?.value ?? "";
}

const dataElementIds = {
    "Suspected Cases": "d4B5pN7ZTEu",
    "Probable Cases": "bUMlIfyJEYK",
    "Confirmed Cases": "ApKJDLI5nHP",
    Deaths: "Sfl82Bx0ZNz",
} as const;

const alertOutbreakCodes = {
    ...diseaseOutbreakCodes,
    hazardType: "RTSL_ZEB_TEA_EVENT_TYPE",
    suspectedDisease: "RTSL_ZEB_TEA_DISEASE",
    verificationStatus: "RTSL_ZEB_TEA_VERIFICATION_STATUS",
    incidentManager: "RTSL_ZEB_TEA_ ALERT_IM_NAME",
} as const;

main();
