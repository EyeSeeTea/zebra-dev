import {
    DiseaseNames,
    HazardNames,
    IncidentStatus,
    PerformanceMetrics717,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../../../domain/entities/Ref";

export enum IndicatorsId {
    suspectedDisease = "jLvbkuvPdZ6",
    hazardType = "Dzrw3Tf0ukB",
    event = "fyrLOW9Iwwv",
    era1 = "Ylmo2fEijff",
    era2 = "w4FOvRAyjEE",
    era3 = "RdLmpMM7lM5",
    era4 = "xT4TgUZhMkk",
    era5 = "UwEdN0kWFqv",
    era6 = "xtetmvZ9WoV",
    era7 = "GgUJMCklxFu",
    detect7d = "cGFwM7qiPzl",
    notify1d = "HDa3nE7Elxj",
    respond7d = "yxVOW4lj4xP",
    province = "ouname",
    id = "tei",
    nationalIncidentStatus = "incidentStatus",
}

type EventTrackerCountIndicatorBase = {
    id: Id;
    type: "disease" | "hazard";
    name: DiseaseNames | HazardNames;
    incidentStatus: IncidentStatus;
    count?: number;
};

export type EventTrackerCountDiseaseIndicator = EventTrackerCountIndicatorBase & {
    type: "disease";
    name: DiseaseNames;
};

export type EventTrackerCountHazardIndicator = EventTrackerCountIndicatorBase & {
    type: "hazard";
    name: HazardNames;
};

export type EventTrackerCountIndicator =
    | EventTrackerCountDiseaseIndicator
    | EventTrackerCountHazardIndicator;

export const PERFORMANCE_METRICS_717_IDS: PerformanceMetrics717[] = [
    { id: "MFk8jiMSlfC", name: "detection", type: "primary" }, // % of number of alerts that were detected within 7 days of date of emergence
    { id: "jD8CfKvvdXt", name: "detection", type: "secondary" }, // Number of alerts notified to public health authorities within 1 day of detection

    { id: "Y6OkqfhGhZb", name: "notification", type: "primary" }, //
    { id: "fKvY7kMydl1", name: "notification", type: "secondary" }, // # events response action started 1 day

    { id: "gEVnF77Uz2u", name: "response", type: "primary" }, // % num of alerts responded d within 7d date not
    { id: "ZX0uPp3ik81", name: "response", type: "secondary" }, // # events response action started 1 day

    { id: "bs4E7tV8QRN", name: "allTargets", type: "primary" }, // % num of alerts detected within 7d date emergence
    { id: "dr4OT0ql4cl", name: "allTargets", type: "secondary" },
];

export const EVENT_TRACKER_717_IDS: PerformanceMetrics717[] = [
    { id: "JuPtc83RFcy", name: "Days to detection", type: "primary" },
    { id: "fNnWRK0SBhD", name: "Days to notification", type: "primary" },
    { id: "dByeVE0Oqtu", name: "Days to early response", type: "primary" },
];
