import { Id } from "../Ref";

export const AlertDataSourceCodes = {
    RTSL_ZEB_OS_DATA_SOURCE_IBS: "RTSL_ZEB_OS_DATA_SOURCE_IBS",
    RTSL_ZEB_OS_DATA_SOURCE_EBS: "RTSL_ZEB_OS_DATA_SOURCE_EBS",
} as const;

export type AlertDataSourceCode = keyof typeof AlertDataSourceCodes;

export type AlertDataSource = { id: Id; name: string; code: AlertDataSourceCode };

export function isAlertDataSourceCode(value: unknown): value is AlertDataSourceCode {
    return typeof value === "string" && value in AlertDataSourceCodes;
}
