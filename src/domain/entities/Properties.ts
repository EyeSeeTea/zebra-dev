//TO DO : Can there be a better name for a generic property?
import { CodedNamedRef } from "./Ref";

type PropertTypes = "string" | "date" | "number" | "boolean";

//TO DO : what other attributes of a generic domain property?
interface BaseProperty extends CodedNamedRef {
    text: string; //or label or key?
    type: PropertTypes;
}

interface StringProperty extends BaseProperty {
    type: "string";
    value: string;
}

interface DateProperty extends BaseProperty {
    type: "date";
    value: Date;
}

interface NumberProperty extends BaseProperty {
    type: "number";
    value: number;
}

interface BooleanProperty extends BaseProperty {
    type: "boolean";
    value: boolean;
}

export type Property = StringProperty | DateProperty | NumberProperty | BooleanProperty;
