import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { DataStoreClient } from "../DataStoreClient";
import { AppSettings } from "../../domain/entities/AppSettings";
import { AppSettingsRepository } from "../../domain/repositories/AppSettingsRepository";
import {
    DataSourceCode,
    dataSourceCodes,
    isDataSourceCode,
} from "../../domain/entities/DataSource";

type AppDatastoreDefaults = {
    diseaseOutbreakDataSource: "ND1" | "ND2";
};

type AppDatastoreSettings = {
    appDefaults: AppDatastoreDefaults;
};

export class AppSettingsD2Repository implements AppSettingsRepository {
    constructor(private dataStoreClient: DataStoreClient) {}

    get(): FutureData<AppSettings> {
        return this.dataStoreClient
            .getObject<AppDatastoreSettings>("app-settings")
            .flatMap(appSettings => {
                if (!appSettings) return Future.error(new Error("App settings not found"));
                return Future.success(this.mapAppDatastoreConfigToAppSettings(appSettings));
            });
    }

    mapAppDatastoreConfigToAppSettings(appDatastoreConfig: AppDatastoreSettings): AppSettings {
        const defaultDataSource = appDatastoreConfig?.appDefaults.diseaseOutbreakDataSource;
        const maybeDataSource = dataSourceCodes[defaultDataSource];
        const dataSource: DataSourceCode =
            maybeDataSource && isDataSourceCode(maybeDataSource)
                ? maybeDataSource
                : dataSourceCodes.ND1;

        return {
            appDefaults: {
                diseaseOutbreakDataSource: dataSource,
            },
        };
    }
}
