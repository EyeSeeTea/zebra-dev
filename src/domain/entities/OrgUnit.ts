import { CodedNamedRef } from "./Ref";

type OrgUnitLevelType = "Province" | "District";

export interface OrgUnit extends CodedNamedRef {
    level: OrgUnitLevelType;
}
