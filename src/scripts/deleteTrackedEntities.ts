import { command, option, run, string } from "cmd-ts";
import path from "path";
import { getAllTrackedEntitiesAsync } from "../data/repositories/utils/getAllTrackedEntities";
import { getApiInstanceFromEnvVariables } from "./common";
import { D2Api } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../data/api-futures";
import { Future } from "../domain/entities/generic/Future";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "",
        args: {
            ou: option({
                type: string,
                long: "orgUnit",
                description: "Org unit id, name or code of teis to be cleared",
            }),
            program: option({
                type: string,
                long: "program",
                description: "Program id, name or code of teis to be cleared",
            }),
        },
        handler: async args => {
            const { api } = getApiInstanceFromEnvVariables();

            return Future.joinObj({
                program: getMetadataByIdentifiable({
                    api: api,
                    identifiableToken: args.program,
                    metadataType: "programs",
                }),
                orgUnit: getMetadataByIdentifiable({
                    api: api,
                    identifiableToken: args.ou,
                    metadataType: "organisationUnits",
                }),
            })
                .flatMap(({ program, orgUnit }) => {
                    return Future.fromPromise(
                        getAllTrackedEntitiesAsync(api, {
                            programId: program.id,
                            orgUnitId: orgUnit.id,
                            ouMode: "DESCENDANTS",
                        })
                    ).flatMap(trackedEntities => {
                        const trackedEntitiesToDelete = trackedEntities.map(tei => ({
                            trackedEntity: tei.trackedEntity,
                        }));

                        if (trackedEntitiesToDelete.length === 0) {
                            console.debug(
                                `No tracked entities found in program ${program.name} and org unit ${orgUnit.name}`
                            );
                            return Future.success(undefined);
                        }

                        return apiToFuture(
                            api.tracker.post(
                                { importStrategy: "DELETE" },
                                { trackedEntities: trackedEntitiesToDelete }
                            )
                        ).flatMap(deleteResponse => {
                            if (deleteResponse.status === "ERROR") {
                                console.error(
                                    `Error deleting tracked entities in program ${
                                        program.name
                                    } and organisation unit ${orgUnit.name}: ${JSON.stringify(
                                        deleteResponse
                                    )}`
                                );
                                return Future.error(
                                    new Error(
                                        `Error deleting tracked entities in program ${program.name}`
                                    )
                                );
                            } else {
                                console.debug(
                                    `Successfully deleted ${trackedEntities.length} tracked entities in program ${program.name} and organisation unit ${orgUnit.name}`
                                );
                                return Future.success(undefined);
                            }
                        });
                    });
                })
                .run(
                    () => {},
                    () => {}
                );
        },
    });

    run(cmd, process.argv.slice(2));
}

main();

function getMetadataByIdentifiable(options: {
    api: D2Api;
    identifiableToken: string;
    metadataType: "programs" | "organisationUnits";
}): FutureData<{ id: string; name: string; code: string }> {
    const { api, identifiableToken, metadataType } = options;

    return apiToFuture(
        api.metadata.get({
            [metadataType]: {
                fields: {
                    id: true,
                    name: true,
                    code: true,
                },
                filter: {
                    identifiable: {
                        token: identifiableToken,
                    },
                },
            },
        })
    ).flatMap(response => {
        const metadata = response[metadataType][0];
        if (!metadata)
            return Future.error(
                new Error(`Metadata not found for ${metadataType} with id ${identifiableToken}`)
            );

        return Future.success(metadata);
    });
}
