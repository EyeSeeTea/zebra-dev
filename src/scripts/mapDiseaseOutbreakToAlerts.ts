import { command, run } from "cmd-ts";
import path from "path";
import { getD2ApiFromArgs } from "./common";
import {
    Attribute,
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "../data/repositories/consts/DiseaseOutbreakConstants";
import { Id } from "../domain/entities/Ref";
import { D2Api } from "@eyeseetea/d2-api/2.36";
import _ from "../domain/entities/generic/Collection";
import { Maybe } from "../utils/ts-utils";

const RTSL_ZEBRA_SUSPECTED_DISEASE_TEA_ID = "jLvbkuvPdZ6";
const RTSL_ZEBRA_HAZARD_TYPE_TEA_ID = "Dzrw3Tf0ukB";
const RTSL_ZEBRA_INCIDENT_STATUS_TEA_ID = "cDLJoNCWHHs";

// Get all TEIs for Zebra Alerts Program which do not have a National Disease Outbreak event Id.
// For each of these, get the disease/hazard type.
// Fetch TEI for Zebra RTSL program with above disease/hazard type (Ideally it should return only 1 TEI, because only 1 National Event per disease/hazard type is allowed) - do error handling if TEIs.length > 1
// Update Zebra Alerts TEI with above National TEI id and incident status.

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show DHIS2 instance info",
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

            try {
                // 1. Get all TEIs for Zebra Alerts Program which do not have a National Disease Outbreak event Id
                const alertTEIs = await getTrackedEntities(
                    api,
                    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
                    RTSL_ZEBRA_ORG_UNIT_ID,
                    "DESCENDANTS"
                );

                const teisWithNoEventId = alertTEIs.filter(tei => {
                    const nationalEventId = getTEIAttributeById(
                        tei,
                        RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
                    );
                    const hazardType = getTEIAttributeById(
                        tei,
                        RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID
                    );
                    const diseaseType = getTEIAttributeById(tei, RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID);

                    return !nationalEventId && (hazardType || diseaseType);
                });

                // 2. For each of these, get the disease/hazard type
                const alertDiseaseHazardType = _(teisWithNoEventId)
                    .map(trackedEntity => {
                        const diseaseAttr = getTEIAttributeById(
                            trackedEntity,
                            RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID
                        );
                        const hazardAttr = getTEIAttributeById(
                            trackedEntity,
                            RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID
                        );

                        return diseaseAttr
                            ? {
                                  attribute: diseaseAttr.attribute,
                                  value: diseaseAttr.value,
                                  type: "DISEASE",
                              }
                            : {
                                  attribute: hazardAttr?.attribute,
                                  value: hazardAttr?.value,
                                  type: "HAZARD",
                              };
                    })
                    .uniqBy(item => `${item.attribute}-${item.value}`)
                    .value();

                // 3. Fetch TEIs for Zebra RTSL program with above disease/hazard type
                // (Ideally it should return only 1 TEI, because only 1 National Event per disease/hazard type is allowed) - do error handling if TEIs.length > 1
                const alertFilters = alertDiseaseHazardType.map(diseaseHazardType =>
                    diseaseHazardType.type === "DISEASE"
                        ? {
                              id: RTSL_ZEBRA_SUSPECTED_DISEASE_TEA_ID,
                              value: diseaseHazardType.value,
                              type: "DISEASE",
                          }
                        : {
                              id: RTSL_ZEBRA_HAZARD_TYPE_TEA_ID,
                              value: diseaseHazardType.value,
                              type: "HAZARD",
                          }
                );

                return alertFilters.map(async filterItem => {
                    const nationalTEIs = await getTrackedEntities(
                        api,
                        RTSL_ZEBRA_PROGRAM_ID,
                        RTSL_ZEBRA_ORG_UNIT_ID,
                        "SELECTED",
                        `${filterItem.id}:IN:${filterItem.value}`
                    );

                    if (nationalTEIs.length > 1) {
                        console.error(
                            `More than 1 National TEIs found for disease/hazard type ${filterItem.value}`
                        );
                    }

                    if (nationalTEIs.length !== 0) {
                        const diseaseOrHazardTypeMatchedTeis = teisWithNoEventId.filter(tei =>
                            tei.attributes?.find(attribute => {
                                if (filterItem.type === "DISEASE") {
                                    return (
                                        attribute.attribute === RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID &&
                                        attribute.value === filterItem.value
                                    );
                                } else {
                                    return (
                                        attribute.attribute ===
                                            RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID &&
                                        attribute.value === filterItem.value
                                    );
                                }
                            })
                        );

                        const nationalEventId = nationalTEIs[0]?.trackedEntity ?? "";
                        const incidentStatus =
                            getTEIAttributeById(nationalTEIs[0], RTSL_ZEBRA_INCIDENT_STATUS_TEA_ID)
                                ?.value ?? "";

                        const teisToMap = diseaseOrHazardTypeMatchedTeis.map(tei => ({
                            ...tei,
                            attributes: [
                                {
                                    attribute:
                                        RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
                                    value: nationalEventId,
                                },
                                {
                                    attribute: RTSL_ZEBRA_ALERTS_NATIONAL_INCIDENT_STATUS_TEA_ID,
                                    value: incidentStatus,
                                },
                            ],
                        }));

                        await api.tracker
                            .post({ importStrategy: "UPDATE" }, { trackedEntities: teisToMap })
                            .getData()
                            .then(response => {
                                if (response.status === "ERROR")
                                    console.error(
                                        "Error mapping disease outbreak event id to alert"
                                    );
                                console.debug(`Updated ${response.stats.updated} TEIs`);
                            });
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

function getTEIAttributeById(
    trackedEntity: Maybe<D2TrackerTrackedEntity>,
    attributeId: Id
): Maybe<Attribute> {
    return trackedEntity?.attributes?.find(attribute => attribute.attribute === attributeId);
}

async function getTrackedEntities(
    api: D2Api,
    program: Id,
    orgUnit: Id,
    ouMode: "SELECTED" | "DESCENDANTS",
    filter?: Maybe<string>
): Promise<D2TrackerTrackedEntity[]> {
    const d2TrackerTrackedEntities: D2TrackerTrackedEntity[] = [];

    const pageSize = 250;
    let page = 1;
    let result: TrackedEntitiesGetResponse;

    do {
        result = await api.tracker.trackedEntities
            .get({
                program: program,
                orgUnit: orgUnit,
                ouMode: ouMode,
                totalPages: true,
                page: page,
                pageSize: pageSize,
                fields: {
                    attributes: true,
                    orgUnit: true,
                    trackedEntity: true,
                    trackedEntityType: true,
                },
                filter: filter,
            })
            .getData();

        d2TrackerTrackedEntities.push(...result.instances);

        page++;
    } while (result.page < Math.ceil((result.total as number) / pageSize));

    return d2TrackerTrackedEntities;
}

main();
