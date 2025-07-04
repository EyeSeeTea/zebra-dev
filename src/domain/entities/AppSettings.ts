import { DataSourceCode } from "./DataSource";

export type AppDefaults = {
    diseaseOutbreakDataSource: DataSourceCode;
};

export type AppSettings = {
    appDefaults: AppDefaults;
};
