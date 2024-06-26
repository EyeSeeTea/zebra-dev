import { CodedNamedRef } from "./Ref";

type PropertTypes = "string" | "date" | "number" | "boolean";

type BaseProperty = CodedNamedRef & {
    type: PropertTypes;
};

type StringProperty = BaseProperty & {
    type: "string";
    value: string;
};

type DateProperty = BaseProperty & {
    type: "date";
    value: Date;
};

type NumberProperty = BaseProperty & {
    type: "number";
    value: number;
};

type BooleanProperty = BaseProperty & {
    type: "boolean";
    value: boolean;
};

export type Property = StringProperty | DateProperty | NumberProperty | BooleanProperty;
