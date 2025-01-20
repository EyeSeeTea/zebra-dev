import { boolean, command, flag, run } from "cmd-ts";
import { setupLogger } from "../utils/logger";
import path from "path";
import { getApiInstanceFromEnvVariables } from "./common";
import _ from "../domain/entities/generic/Collection";
import { AlertD2Repository } from "../data/repositories/AlertD2Repository";
import { NotificationD2Repository } from "../data/repositories/NotificationD2Repository";
import { AlertSyncDataStoreRepository } from "../data/repositories/AlertSyncDataStoreRepository";
import { UserGroupD2Repository } from "../data/repositories/UserGroupD2Repository";
import { MapAndSaveAlertsUseCase } from "../domain/usecases/MapAndSaveAlertsUseCase";
import { OutbreakAlertD2Repository } from "../data/repositories/OutbreakAlertD2Repository";
import { DiseaseOutbreakEventD2Repository } from "../data/repositories/DiseaseOutbreakEventD2Repository";
import { ConfigurationsD2Repository } from "../data/repositories/ConfigurationsD2Repository";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description:
            "Map national event ID to Zebra Alert Events with no event ID, and save alert data to datastore",
        args: {
            debug: flag({
                type: boolean,
                defaultValue: () => true,
                long: "debug",
                description: "Option to print also logs in console",
            }),
        },
        handler: async args => {
            const { api, instance } = getApiInstanceFromEnvVariables();
            await setupLogger(instance, { isDebug: args.debug });

            const alertRepository = new AlertD2Repository(api);
            const alertSyncRepository = new AlertSyncDataStoreRepository(api);
            const diseaseOutbreakEventRepository = new DiseaseOutbreakEventD2Repository(api);
            const notificationRepository = new NotificationD2Repository(api);
            const outbreakAlertRepository = new OutbreakAlertD2Repository(api);
            const configurationsRepository = new ConfigurationsD2Repository(api);
            const userGroupRepository = new UserGroupD2Repository(api);

            const mapAndSaveAlertsUseCase = new MapAndSaveAlertsUseCase({
                alertRepository: alertRepository,
                outbreakAlertRepository: outbreakAlertRepository,
                alertSyncRepository: alertSyncRepository,
                diseaseOutbreakEventRepository: diseaseOutbreakEventRepository,
                notificationRepository: notificationRepository,
                userGroupRepository: userGroupRepository,
                configurationsRepository: configurationsRepository,
            });

            return await mapAndSaveAlertsUseCase.execute();
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
