import { Id } from "../../../domain/entities/Ref";

export type AlertsPerformanceOverviewDimensions = {
    teiId: "tei";
    eventEBSId: Id;
    eventIBSId: Id;
    nationalDiseaseOutbreakEventId: Id;
    suspectedDisease: Id;
    confirmedDisease: Id;
    orgUnit: "ouname";
    orgUnitHierarchy: "ounamehierarchy";
    cases: Id;
    deaths: Id;
    date: "enrollmentdate";
    notify1d: Id;
    detect7d: Id;
    incidentManager: Id;
    respond7d: Id;
    incidentStatus: Id;
    emergedDate: Id;
    detectionDate: Id;
    notifiedDate: Id;
    respondedDate: Id;
    detectedDate: Id;
};

export type AlertsPerformanceOverviewDimensionsKey = keyof AlertsPerformanceOverviewDimensions;

export type AlertsPerformanceOverviewDimensionsValue =
    AlertsPerformanceOverviewDimensions[AlertsPerformanceOverviewDimensionsKey];
