export type Option<Value extends string = string> = {
    value: Value;
    label: string;
    disabled?: boolean;
};
