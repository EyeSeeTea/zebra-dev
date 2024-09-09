export type Alert = {
    id: string;
    orgUnit: string | undefined;
    attributes: {
        attribute: string;
        value: string;
    }[];
};
