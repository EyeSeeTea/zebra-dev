import { DataSourceKey } from "./disease-outbreak-event/DiseaseOutbreakEvent";
import { Id } from "./Ref";

export type AppDefaults = {
    diseaseOutbreakDataSource: DataSourceKey;
};

export type UserGroupsSettings = {
    visualizer: string[];
    capture: string[];
    admin: string[];
};

export type CasesFileTemplateSettings = {
    fileId: Id;
    fileName: string;
};

export type AppSettings = {
    userGroups: UserGroupsSettings;
    casesFileTemplate: CasesFileTemplateSettings;
    appDefaults: AppDefaults;
};
