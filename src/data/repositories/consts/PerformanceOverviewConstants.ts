import {
    DiseaseNames,
    HazardNames,
    IncidentStatus,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../../../domain/entities/Ref";

export type PerformanceOverviewDimensions = {
    teiId: "tei";
    event: Id;
    province: "ouname";
    era1ProgramIndicator: Id;
    era2ProgramIndicator: Id;
    era3ProgramIndicator: Id;
    era4ProgramIndicator: Id;
    era5ProgramIndicator: Id;
    era6ProgramIndicator: Id;
    era7ProgramIndicator: Id;
    detect7dProgramIndicator: Id;
    notify1dProgramIndicator: Id;
    respond7dProgramIndicator: Id;
    suspectedDisease: Id;
    hazardType: Id;
    nationalIncidentStatus: "incidentStatus";
    date: "enrollmentdate";
    eventSource: Id;
};

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
