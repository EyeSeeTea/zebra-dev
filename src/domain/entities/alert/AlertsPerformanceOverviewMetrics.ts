import { AlertDataSource } from "./Alert";
import { OrgUnitLevelType } from "../OrgUnit";
import { Id } from "../Ref";

export type AlertsPerformanceOverviewMetrics = {
    teiId: Id;
    eventEBSId: Id;
    eventIBSId: Id;
    nationalDiseaseOutbreakEventId: Id;
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
    eventSource: AlertDataSource;
};
