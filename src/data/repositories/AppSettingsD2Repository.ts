import { D2Api } from "@eyeseetea/d2-api/2.36";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import { AppDatastoreConfig } from "../entities/AppDatastoreConfig";
import { DataStoreClient } from "../DataStoreClient";
import { AppSettings } from "../../domain/entities/AppSettings";
import { AppSettingsRepository } from "../../domain/repositories/AppSettingsRepository";
import { dataSourceMap } from "./consts/DiseaseOutbreakConstants";
import {
    DataSource,
    isDataSourceKey,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export class AppSettingsD2Repository implements AppSettingsRepository {
    constructor(private api: D2Api, private dataStoreClient: DataStoreClient) {}

    get(): FutureData<AppSettings> {
        return this.dataStoreClient
            .getObject<AppDatastoreConfig>("app-config")
            .flatMap(appConfig => {
                if (!appConfig) return Future.error(new Error("App configuration not found"));
                return Future.success(this.mapAppDatastoreConfigToAppSettings(appConfig));
            });
    }

    mapAppDatastoreConfigToAppSettings(appDatastoreConfig: AppDatastoreConfig): AppSettings {
        const defaultDataSource = appDatastoreConfig?.appDefaults.diseaseOutbreakDataSource;
        const maybeDataSource = dataSourceMap[defaultDataSource];
        const dataSource =
            maybeDataSource && isDataSourceKey(maybeDataSource) ? maybeDataSource : DataSource.ND1;

        return {
            userGroups: appDatastoreConfig.userGroups,
            casesFileTemplate: appDatastoreConfig.casesFileTemplate,
            appDefaults: {
                diseaseOutbreakDataSource: dataSource,
            },
        };
    }
}
