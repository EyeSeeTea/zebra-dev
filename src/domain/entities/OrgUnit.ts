import { CodedNamedRef } from "./Ref";

export type OrgUnitLevelType = "National" | "Province" | "District" | "Health Facility";

export type OrgUnit = CodedNamedRef & {
    level: OrgUnitLevelType;
};

export const orgUnitLevelTypeByLevelNumber: Record<number, OrgUnitLevelType> = {
    1: "National",
    2: "Province",
    3: "District",
    4: "Health Facility",
};
