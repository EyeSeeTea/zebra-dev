import { DataSourceKey } from "./disease-outbreak-event/DiseaseOutbreakEvent";

export type AppDefaults = {
    diseaseOutbreakDataSource: DataSourceKey;
};

export type AppSettings = {
    appDefaults: AppDefaults;
};
