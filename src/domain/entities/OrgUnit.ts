import { CodedNamedRef } from "./Ref";

export type OrgUnitLevelType = "National" | "Province" | "District";

export type OrgUnit = CodedNamedRef & {
    level: OrgUnitLevelType;
};
