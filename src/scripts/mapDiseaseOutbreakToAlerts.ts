import { command, run } from "cmd-ts";
import path from "path";
import { getD2ApiFromArgs } from "./common";
// import {
//     D2TrackerTrackedEntity,
//     TrackedEntitiesGetResponse,
// } from "@eyeseetea/d2-api/api/trackerTrackedEntities";

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
                url: process.env.VITE_DHIS2_AUTH,
                auth: {
                    username: username,
                    password: password,
                },
            };

            const api = getD2ApiFromArgs(envVars);

            // const d2TrackerTrackedEntities: D2TrackerTrackedEntity[] = [];

            // const pageSize = 250;
            // let page = 1;
            // let result: TrackedEntitiesGetResponse;

            // try {
            //     do {
            //         result = await api.tracker.trackedEntities
            //             .get({
            //                 program: "qkOTdxkte8V",
            //                 orgUnit: "PS5JpkoHHio",
            //                 totalPages: true,
            //                 page: page,
            //                 pageSize: pageSize,
            //                 fields: {
            //                     attributes: true,
            //                     orgUnit: true,
            //                     trackedEntity: true,
            //                     trackedEntityType: true,
            //                 },
            //             })
            //             .getData();

            //         d2TrackerTrackedEntities.push(...result.instances);

            //         console.debug(d2TrackerTrackedEntities);

            //         page++;
            //     } while (result.page < Math.ceil((result.total as number) / pageSize));
            //     api.tracker.post(
            //         { importStrategy: "DELETE" },
            //         { trackedEntities: d2TrackerTrackedEntities }
            //     );
            // } catch (error) {
            //     console.error({ error });
            //     return [];
            // }

            console.debug(api, username, password);

            const info = await api.system.info.getData();
            console.debug(info);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
