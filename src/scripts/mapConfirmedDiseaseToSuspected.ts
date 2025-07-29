import { command, run } from "cmd-ts";
import path from "path";
import { getApiInstanceFromEnvVariables } from "./common";
import _ from "../domain/entities/generic/Collection";
import { AlertD2Repository } from "../data/repositories/AlertD2Repository";
import { MapConfirmedDiseaseToSuspectedUseCase } from "../domain/usecases/MapConfirmedDiseaseToSuspectedUseCase";
import logger from "./utils/console-logger";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Map Confirmed Disease to Suspected Disease",
        args: {},
        handler: async () => {
            try {
                const { api, instance } = getApiInstanceFromEnvVariables();

                logger.info(
                    `Starting mapping confirmed disease to suspected disease script in instance url ${instance.url} by user ${instance.auth?.username}`
                );

                const alertRepository = new AlertD2Repository(api);

                const mapConfirmedDiseaseToSuspectedUseCase =
                    new MapConfirmedDiseaseToSuspectedUseCase({
                        alertRepository: alertRepository,
                    });

                return mapConfirmedDiseaseToSuspectedUseCase.execute().run(
                    () => {
                        logger.info(
                            `Mapping confirmed disease to suspected disease script completed successfully.`
                        );
                        process.exit(0);
                    },
                    error => {
                        logger.error(
                            `Error occurred while mapping confirmed disease to suspected disease: ${error}`
                        );
                        process.exit(1);
                    }
                );
            } catch (err) {
                logger.error(
                    `Error occurred while mapping confirmed disease to suspected disease: ${
                        err instanceof Error ? err.message : String(err)
                    }`
                );
                process.exit(1);
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
