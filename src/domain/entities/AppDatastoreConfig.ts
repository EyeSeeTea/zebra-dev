import { Id } from "./Ref";

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
};
