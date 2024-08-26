declare module "@dhis2/analytics" {
    export type AnalyticsResponse = {
        response: {
            headers: AnalyticsResponseHeader[];
            metaData: AnalyticsResponseMetadata;
            rows: Array<string[]>;
        };
        headers: AnalyticsResponseHeader[];
        metaData: AnalyticsResponseMetadata;
        rows: Array<string[]>;
    };

    export type AnalyticsResponseHeader = {
        name: string;
        column: string;
        valueType: "TEXT" | "NUMBER";
        type: "java.lang.String" | "java.lang.Double";
        hidden: boolean;
        meta: boolean;
        isPrefix?: boolean;
        isCollect?: boolean;
        index?: number;
    };

    export type AnalyticsResponseMetadata = {
        items: Record<string, AnalyticsMetadataItem>;
        dimensions: Record<string, string[]>;
    };

    export type AnalyticsMetadataItem = {
        uid?: string;
        code?: string;
        name: string;
        description?: string;
        dimensionItemType?:
            | "PERIOD"
            | "ORGANISATION_UNIT"
            | "CATEGORY_OPTION"
            | "DATA_ELEMENT"
            | "INDICATOR";
        dimensionType?:
            | "PERIOD"
            | "ORGANISATION_UNIT"
            | "CATEGORY_OPTION"
            | "DATA_ELEMENT"
            | "INDICATOR"
            | "DATA_X";
        legendSet?: string;
        valueType?: string;
        totalAggregationType?: "SUM" | "AVERAGE";
        indicatorType?: unknown;
        startDate?: string;
        endDate?: string;
    };

    export type Layout = {
        rows: LayoutDimension[];
        columns: LayoutDimension[];
        filters: LayoutDimension[];
    };

    export type LayoutDimension = { id: Dimension; dimension: Dimension; items: DimensionItem[] };

    export const DIMENSION_ID_DATA = "dx";
    export const DIMENSION_ID_PERIOD = "pe";
    export const DIMENSION_ID_ORGUNIT = "ou";
    export const DIMENSION_ID_ASSIGNED_CATEGORIES = "co";
    export const DIMENSION_PROP_NO_ITEMS = "noItems";

    export type Dimension = DIMENSION_ID_ORGUNIT | DIMENSION_ID_PERIOD | DIMENSION_ID_DATA | string;
    export type DimensionItem = {
        name: string;
        id: string;
        dimensionItemType:
            | "DATA_ELEMENT"
            | "DATA_ELEMENT_OPERAND"
            | "INDICATOR"
            | "REPORTING_RATE"
            | "PROGRAM_DATA_ELEMENT"
            | "PROGRAM_ATTRIBUTE"
            | "PROGRAM_INDICATOR"
            | "PERIOD"
            | "ORGANISATION_UNIT"
            | "CATEGORY_OPTION"
            | "OPTION_GROUP"
            | "DATA_ELEMENT_GROUP"
            | "ORGANISATION_UNIT_GROUP"
            | "CATEGORY_OPTION_GROUP";
    };

    export class Analytics {
        static getAnalytics(dataEngine: unknown);
    }
    export class AnalyticsEnrollments {
        static getQuery(dataEngine: unknown);
    }
}
