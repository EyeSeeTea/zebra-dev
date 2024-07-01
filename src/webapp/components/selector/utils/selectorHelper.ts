export type SelectorOption<Value extends string = string> = {
    value: Value;
    label: string;
    disabled?: boolean;
};

export function getLabelFromValue<Value extends string = string>(
    value: Value,
    options: SelectorOption<Value>[]
) {
    return options.find(option => option.value === value)?.label;
}
