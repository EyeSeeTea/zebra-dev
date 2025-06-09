import { isValueInUnionType, Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";

export const UNKNOWN_DISEASE_NAME = "Unknown" as const;

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
    UNKNOWN_DISEASE_NAME,
] as const;

export type DiseaseNames = (typeof diseaseNames)[number];

export function isDiseaseName(name: Maybe<string>): name is DiseaseNames {
    return isValueInUnionType(name, diseaseNames);
}

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

const incidentStatuses = ["Watch", "Alert", "Respond"] as const;
export type IncidentStatus = (typeof incidentStatuses)[number];
export const isIncidentStatus = (status: string): status is IncidentStatus => {
    return incidentStatuses.includes(status as IncidentStatus);
};

export type IncidentStatusFilter = IncidentStatus | "ALL";

type BaseCounts = {
    name: DiseaseNames;
    total: number;
    incidentStatus: IncidentStatusFilter;
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
    disease?: DiseaseNames;
    total?: number;
};

export type TotalPerformanceMetrics717 = {
    id: string;
    type: "total";
    value?: number | "Inc";
    key: PerformanceMetrics717Key;
    disease?: DiseaseNames;
};

export type PerformanceMetricsStatus = "active" | "completed";
