export const MAP_CURRENT_APP = "ZEBRA";

export type MapProgramIndicator = {
    id: string;
    name: string;
    disease: string | null;
    incidentStatus: string | null;
    dataSource: string | null;
};

export enum MapProgramIndicatorsDatastoreKey {
    ActiveVerifiedAlerts = "active-verified-alerts-program-indicators",
    SuspectedCasesCasesProgram = "suspected-cases-cases-program-indicators",
}

export type MapConfig = {
    currentApp: "ZEBRA";
    currentPage: string;
    mapId: string;
    programId: string;
    programName: string;
    startDate: string;
    timeField: string;
    programIndicators: MapProgramIndicator[];
    zebraNamespace: "zebra";
    mapProgramIndicatorDatastoreKey: MapProgramIndicatorsDatastoreKey;
};

export type MapKey = "dashboard" | "event_tracker";
