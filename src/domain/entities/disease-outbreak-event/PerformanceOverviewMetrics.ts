import { Id } from "../Ref";

export type DiseaseNames =
    | "AFP"
    | "Acute VHF"
    | "Acute respiratory"
    | "Anthrax"
    | "Bacterial meningitis"
    | "COVID19"
    | "Cholera"
    | "Diarrhoea with blood"
    | "Measles"
    | "Monkeypox"
    | "Neonatal tetanus"
    | "Plague"
    | "SARIs"
    | "Typhoid fever"
    | "Zika fever";

export type HazardNames =
    | "Animal type"
    | "Human type"
    | "Human and Animal type"
    | "Environmental type";

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
    creationDate: string;
    suspectedDisease: DiseaseNames;
    hazardType: HazardNames;
};

type BaseCounts = {
    name: DiseaseNames | HazardNames;
    total: number;
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

export type EventTrackerCounts = DiseaseCounts | HazardCounts;
