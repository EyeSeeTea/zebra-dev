import { Maybe } from "../../utils/ts-utils";
import { CodedNamedRef } from "./Ref";

type OrgUnitLevelType = "Province" | "District";

export type OrgUnit = CodedNamedRef & {
    level: Maybe<OrgUnitLevelType>;
};
