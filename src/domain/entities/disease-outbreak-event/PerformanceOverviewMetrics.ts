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

export type PerformanceOverviewMetrics = {
    id: Id;
    event: string;
    province: string;
    duration: string;
    cases: string;
    deaths: string;
    era1: string;
    era2: string;
    era3: string;
    era4: string;
    era5: string;
    era6: string;
    era7: string;
    suspectedDisease: DiseaseNames;
    date: string;
    incidentManagerUsername: string;
};

export type IncidentStatus = "Watch" | "Alert" | "Respond" | "ALL";

type BaseCounts = {
    name: DiseaseNames;
    total: number;
    incidentStatus: IncidentStatus;
    type: "disease";
};

type DiseaseCounts = BaseCounts & {
    name: DiseaseNames;
    type: "disease";
};

export type TotalCardCounts = DiseaseCounts;

export type PerformanceMetrics717Key = "national" | "event" | "alerts";

export type PerformanceMetrics717 = {
    id: string;
    name: string;
    type: "primary" | "secondary";
    value?: number | "Inc";
    key: PerformanceMetrics717Key;
};
