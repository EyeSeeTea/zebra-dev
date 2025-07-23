import { Id } from "./Ref";

export const dataSourceCodes = {
    ND1: "ND1",
    ND2: "ND2",
} as const;

export type DataSourceCode = keyof typeof dataSourceCodes;

export type DataSource = { id: Id; name: string; code: DataSourceCode };

export function isDataSourceCode(value: unknown): value is DataSourceCode {
    return typeof value === "string" && value in dataSourceCodes;
}
