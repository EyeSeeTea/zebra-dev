export type Alert = {
    trackedEntity: string | undefined;
    trackedEntityType: string | undefined;
    orgUnit: string | undefined;
    attributes: {
        attribute: string;
        value: string;
    }[];
};
