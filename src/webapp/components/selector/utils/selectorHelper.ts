export type SelectorOption<T extends string = string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

export function getLabelFromValue<T extends string = string>(
    value: SelectorOption["value"],
    options: SelectorOption<T>[]
) {
    return options.find(option => option.value === value)?.label;
}
