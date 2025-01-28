import { DataSource } from "../disease-outbreak-event/DiseaseOutbreakEvent";
import { OrgUnitLevelType } from "../OrgUnit";
import { Id } from "../Ref";

export type AlertsPerformanceOverviewMetrics = {
    teiId: Id;
    eventEBSId: Id;
    eventIBSId: Id;
    nationalDiseaseOutbreakEventId: Id;
    hazardType: string;
    suspectedDisease: string;
    province: string;
    orgUnit: string;
    orgUnitType: OrgUnitLevelType;
    cases: string;
    deaths: string;
    duration: string;
    date: string;
    detect7d: string;
    notify1d: string;
    incidentManager: string;
    respond7d: string;
    incidentStatus: string;
    eventSource: DataSource;
};
