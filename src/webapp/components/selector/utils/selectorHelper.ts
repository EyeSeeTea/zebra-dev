import { Option } from "../../utils/option";

export function getLabelFromValue<Value extends string = string>(
    value: Value,
    options: Option<Value>[]
) {
    return options.find(option => option.value === value)?.label;
}
