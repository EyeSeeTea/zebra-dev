import { Id } from "../../domain/entities/Ref";

export type AppDatastoreConfig = {
    userGroups: {
        visualizer: string[];
        capture: string[];
        admin: string[];
    };
    casesFileTemplate: {
        fileId: Id;
        fileName: string;
    };
    appDefaults: {
        diseaseOutbreakDataSource: string;
    };
};
