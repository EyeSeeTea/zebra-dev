import { CodedNamedRef } from "./Ref";

type OrgUnitLevelType = "Province" | "District";

export type OrgUnit = CodedNamedRef & {
    level?: OrgUnitLevelType;
};
