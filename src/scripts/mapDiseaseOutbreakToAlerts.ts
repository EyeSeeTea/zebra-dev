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
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DataSource,
    IncidentStatusType,
} from "../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { AlertOptions } from "../domain/repositories/AlertRepository";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import { Maybe } from "../utils/ts-utils";

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

            try {
                // 1. Get all TEIs for Zebra Alerts Program which do not have a National Disease Outbreak event Id
                const alertTrackedEntities = await alertRepository.getTrackedEntitiesByTEACodeAsync(
                    {
                        program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                        ouMode: "DESCENDANTS",
                    }
                );

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
                                    uniqueKey: getAttributeUniqueKey(diseaseType),
                                };
                            } else if (hazardType) {
                                return {
                                    ...trackedEntity,
                                    ...hazardType,
                                    type: "HAZARD",
                                    uniqueKey: getAttributeUniqueKey(hazardType),
                                };
                            }
                        }
                        return undefined;
                    })
                    .value();

                console.debug(
                    `There are ${alertsWithNoEventId.length} events in the Zebra Alerts program without event id`
                );

                // 2. For each of these, get the disease/hazard type, get the unique disease/hazard type
                const alertFilters = _(alertsWithNoEventId)
                    .uniqBy(item => item.uniqueKey)
                    .compactMap(item => {
                        if (item.type === "DISEASE") {
                            return {
                                attribute: "jLvbkuvPdZ6",
                                value: item.value,
                                type: item.type,
                            };
                        } else if (item.type === "HAZARD") {
                            return {
                                attribute: "Dzrw3Tf0ukB",
                                value: item.value,
                                type: item.type,
                            };
                        }
                    })
                    .value();

                const alerts = _(alertFilters)
                    .compactMap(async filterItem => {
                        const nationalTEIs = await alertRepository.getTrackedEntitiesByTEACodeAsync(
                            {
                                program: RTSL_ZEBRA_PROGRAM_ID,
                                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                                ouMode: "SELECTED",
                                filter: { id: filterItem.attribute, value: filterItem.value },
                            }
                        );

                        if (nationalTEIs.length > 1) {
                            console.error(
                                `More than 1 National TEI found for ${
                                    filterItem.attribute
                                }  ${filterItem.type.toLocaleLowerCase()} type with code ${
                                    filterItem.value
                                }`
                            );

                            return undefined;
                        } else if (nationalTEIs.length === 0) {
                            console.debug(
                                `There is no national event with ${
                                    filterItem.value
                                } ${filterItem.type.toLocaleLowerCase()} type`
                            );

                            // send notification
                            // await api.messageConversations
                            //     .post({
                            //         subject: "No National Event Found",
                            //         text: `There is no national event found for ${
                            //             filterItem.value
                            //         } ${filterItem.type.toLocaleLowerCase()} type`,
                            //         users: [{ id: "TC5tfBmieZ6" }],
                            //     })
                            //     .getData()
                            //     .then(response => console.debug(response))
                            //     .catch(error => console.error(error));

                            return undefined;
                        }

                        const nationalTrackedEntity = nationalTEIs[0];
                        if (!nationalTrackedEntity) return undefined;

                        return _(alertsWithNoEventId)
                            .compactMap(alertTrackedEntity => {
                                if (
                                    alertTrackedEntity.type !== filterItem.type &&
                                    alertTrackedEntity.value !== filterItem.value &&
                                    alertTrackedEntity.attribute !== filterItem.attribute
                                )
                                    return undefined;

                                const alertOutbreak = mapTrackedEntityAttributesToAlertOutbreak(
                                    nationalTrackedEntity,
                                    alertTrackedEntity
                                );

                                // 4. Update Zebra Alerts TEI with above National TEI id and incident status.
                                alertRepository.updateAlerts(alertOutbreak).run(
                                    () => console.debug("Successfully updated alert"),
                                    error => console.error(error)
                                );

                                const verificationStatus = getValueFromMap(
                                    "verificationStatus",
                                    alertTrackedEntity
                                );

                                if (verificationStatus === "VERIFIED") {
                                    const dataValues = alertTrackedEntity.enrollments
                                        ? alertTrackedEntity.enrollments[0]?.events[0]?.dataValues
                                        : [];

                                    const alertData = {
                                        type: alertTrackedEntity.type,
                                        alertId: alertTrackedEntity.trackedEntity,
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
                                        Deaths: getDataValueFromMap("Deaths", dataValues),
                                    };

                                    return alertData;
                                } else {
                                    return undefined;
                                }
                            })
                            .value();
                    })
                    .value();

                const alertsToSave = _(await Promise.all(alerts))
                    .flatten()
                    .compact()
                    .value();

                // save date and time for the particular hazard or disease type -> zebra : synchronization
                await api
                    .dataStore("zebra")
                    .save("synchronization", alertsToSave)
                    .getData()
                    .then(response => console.debug(response))
                    .catch(error => console.error(error));
            } catch (error) {
                console.error(error);
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

function getAttributeUniqueKey(attribute: Attribute): string {
    return `${attribute.attribute}-${attribute.value}`;
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
} as const;

main();
