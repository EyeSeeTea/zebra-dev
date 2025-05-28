import { Code } from "../../../domain/entities/Ref";
import { ResourceType } from "../../../domain/entities/resources/ResourceTypeNamed";
import { GetValue } from "../../../utils/ts-utils";

// In ZEBRA Resources program
export const RTSL_ZEBRA_RESOURCES_ORG_UNIT_ID = "PS5JpkoHHio";
export const RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_ID = "vYSr34hP8Lq";
export const RTSL_ZEBRA_RESOURCES_EVENT_PROGRAM_STAGE_ID = "z3FrAVjM1cv";
export const RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_DATA_ELEMENT_ID = "Bpxe66R2nTZ";

// In ZEBRA program
export const RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_PROGRAM_STAGE_ID = "LBZKpbTYzue";
export const RTSL_ZEBRA_RESOURCES_DISEASE_OUTBREAK_RESOURCE_ID_DATA_ELEMENT_ID = "QYGkWKJzgg3";

export const resourcesCodesConstants = {
    fileId: "RTSL_ZEB_DET_RESOURCES_FILE_ID",
    folder: "RTSL_ZEB_DET_RESOURCES_FILE_FOLDER",
    name: "RTSL_ZEB_DET_RESOURCES_FILE_NAME",
    type: "RTSL_ZEB_DET_RESOURCES_RESOURCE_TYPE",
    diseaseOutbreakId: "RTSL_ZEB_DET_RESOURCES_DISEASE_OUTBREAK_EVENT_ID",
} as const;

export type ResourcesCodes = GetValue<typeof resourcesCodesConstants>;

export type ResourcesKeyCode =
    (typeof resourcesCodesConstants)[keyof typeof resourcesCodesConstants];

export function isStringInResourcesCodes(code: string): code is ResourcesKeyCode {
    return (Object.values(resourcesCodesConstants) as string[]).includes(code);
}

export const resourcesIds = {
    fileId: "iAu5eyrn0D3",
    folder: "zOVceduwwi7",
    name: "T5OD6hf24dQ",
    type: "a8w4InkG4i1",
    diseaseOutbreakId: "Bpxe66R2nTZ",
} as const;

export const eventFields = {
    event: true,
    program: true,
    orgUnit: true,
    dataValues: {
        dataElement: { id: true, code: true },
        value: true,
    },
    occurredAt: true,
    status: true,
} as const;

const resourceTypeToDHIS2ResourceTypeMap: Record<ResourceType, Code> = {
    [ResourceType.TEMPLATE]: "RTSL_ZEB_OS_RESOURCE_TYPE_TEMPLATE",
    [ResourceType.RESPONSE_DOCUMENT]: "RTSL_ZEB_OS_RESOURCE_TYPE_RESPONSE_DOCUMENT",
    [ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT]:
        "RTSL_ZEB_OS_RESOURCE_TYPE_DISEASE_OUTBREAK_EVENT_DOCUMENT",
} as const;

export function resourceTypeToDHIS2ResourceType(resourceType: ResourceType): Code {
    return resourceTypeToDHIS2ResourceTypeMap[resourceType];
}

const dhis2ResourceTypeToResourceTypeMap = {
    RTSL_ZEB_OS_RESOURCE_TYPE_TEMPLATE: ResourceType.TEMPLATE,
    RTSL_ZEB_OS_RESOURCE_TYPE_RESPONSE_DOCUMENT: ResourceType.RESPONSE_DOCUMENT,
    RTSL_ZEB_OS_RESOURCE_TYPE_DISEASE_OUTBREAK_EVENT_DOCUMENT:
        ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT,
} as const satisfies Record<Code, ResourceType>;

type DHIS2ResourceType = keyof typeof dhis2ResourceTypeToResourceTypeMap;

export function isDHIS2ResourceType(value: Code): value is DHIS2ResourceType {
    return value in dhis2ResourceTypeToResourceTypeMap;
}

export function dhis2ResourceTypeToResourceType(value: DHIS2ResourceType): ResourceType {
    return dhis2ResourceTypeToResourceTypeMap[value];
}
