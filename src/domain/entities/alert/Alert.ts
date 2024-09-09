export type Alert = {
    trackedEntity: string;
    orgUnit: string | undefined;
    attributes: {
        attribute: string;
        value: string;
    }[];
};
