type UserGroupsSettings = {
    visualizer: string[];
    capture: string[];
    admin: string[];
};

export type DatastorePermissionsSettings = {
    userGroups: UserGroupsSettings;
};
