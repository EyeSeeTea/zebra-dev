import {
    DiseaseNames,
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
    suspectedDisease: Id;
    date: "enrollmentdate";
};

type EventTrackerCountIndicatorBase = {
    id: Id;
    type: "disease" | "hazard";
    name: DiseaseNames;
    incidentStatus: IncidentStatus;
    count?: number;
};

export type EventTrackerCountDiseaseIndicator = EventTrackerCountIndicatorBase & {
    type: "disease";
    name: DiseaseNames;
};

export type EventTrackerCountIndicator = EventTrackerCountDiseaseIndicator;
