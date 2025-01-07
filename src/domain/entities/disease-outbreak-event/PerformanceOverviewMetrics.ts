import { Id } from "../Ref";

export const diseaseNames = [
    "AFP",
    "Acute VHF",
    "Acute respiratory",
    "Anthrax",
    "Bacterial meningitis",
    "COVID19",
    "Cholera",
    "Diarrhoea with blood",
    "Measles",
    "Monkeypox",
    "Neonatal tetanus",
    "Plague",
    "SARIs",
    "Typhoid fever",
    "Zika fever",
] as const;
export type DiseaseNames = (typeof diseaseNames)[number];

export const hazardNames = [
    "Biological: Animal",
    "Biological: Human",
    "Biological: Human and Animal",
    "Environmental",
    // "Chemical",
    // "Unknown",
] as const;

export type HazardNames = (typeof hazardNames)[number];

export type PerformanceOverviewMetrics = {
    id: Id;
    event: string;
    province: string;
    duration: string;
    manager: string;
    cases: string;
    deaths: string;
    era1: string;
    era2: string;
    era3: string;
    era4: string;
    era5: string;
    era6: string;
    era7: string;
    detect7d: string;
    notify1d: string;
    respond7d: string;
    suspectedDisease: DiseaseNames;
    hazardType: HazardNames;
    nationalIncidentStatus: string;
    date: string;
};

export type IncidentStatus = "Watch" | "Alert" | "Respond" | "ALL";

type BaseCounts = {
    name: DiseaseNames | HazardNames;
    total: number;
    incidentStatus: IncidentStatus;
    type: "disease" | "hazard";
};

type DiseaseCounts = BaseCounts & {
    name: DiseaseNames;
    type: "disease";
};

type HazardCounts = BaseCounts & {
    name: HazardNames;
    type: "hazard";
};

export type TotalCardCounts = DiseaseCounts | HazardCounts;

export type PerformanceMetrics717Key = "national" | "event" | "alerts";

export type PerformanceMetrics717 = {
    id: string;
    name: string;
    type: "primary" | "secondary";
    value?: number | "Inc";
    key: PerformanceMetrics717Key;
};
