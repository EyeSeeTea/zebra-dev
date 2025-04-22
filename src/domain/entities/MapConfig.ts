export const MAP_CURRENT_APP = "ZEBRA";

//TODO: 8698prv94 - remove hazard type
export type MapProgramIndicator = {
    id: string;
    name: string;
    disease: string | null;
    hazardType: string | null;
    incidentStatus: string | null;
};

export enum MapProgramIndicatorsDatastoreKey {
    ActiveVerifiedAlerts = "active-verified-alerts-program-indicators",
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
    dashboardDatastoreKey: MapProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts;
};

export type MapKey = "dashboard" | "event_tracker";
