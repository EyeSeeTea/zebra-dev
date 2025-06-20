import { Id } from "../../domain/entities/Ref";

export type AppDatastoreConfig = {
    userGroups: {
        visualizer: Id[];
        capture: Id[];
        admin: Id[];
    };
    casesFileTemplate: {
        fileId: Id;
        fileName: string;
    };
    appDefaults: {
        diseaseOutbreakDataSource: string;
    };
};
