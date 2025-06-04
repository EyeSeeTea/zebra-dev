import { AlertsPerformanceOverviewMetrics } from "../../../domain/entities/alert/AlertsPerformanceOverviewMetrics";
import { AlertDataSource } from "../../../domain/entities/alert/Alert";
import {
    DiseaseNames,
    PerformanceMetrics717,
    PerformanceMetricsStatus,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../../../domain/entities/generic/Future";
import { OverviewCard } from "../../../domain/entities/PerformanceOverview";
import { Id } from "../../../domain/entities/Ref";
import { PerformanceOverviewRepository } from "../../../domain/repositories/PerformanceOverviewRepository";
import { FutureData } from "../../api-futures";
import { Maybe } from "../../../utils/ts-utils";

export class PerformanceOverviewTestRepository implements PerformanceOverviewRepository {
    getEvent717Performance(_diseaseOutbreakEventId: Id): FutureData<PerformanceMetrics717[]> {
        return Future.success([]);
    }
    getEventTrackerOverviewMetrics(): FutureData<OverviewCard[]> {
        throw Future.success([]);
    }
    getTotalCardCounts(): FutureData<any> {
        return Future.success(0);
    }
    getNational717Performance(): FutureData<any> {
        return Future.success(0);
    }

    getAlerts717Performance(
        _performanceMetricsStatus: PerformanceMetricsStatus,
        _diseaseName: Maybe<DiseaseNames>
    ): FutureData<any> {
        return Future.success(0);
    }

    getNationalPerformanceOverviewMetrics(): FutureData<any[]> {
        return Future.success([
            {
                id: "JPenxAnjdhY",
                incidentManagerUsername: "dev.user",
                creationDate: "2024-08-27 11:07:48.68",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Cholera",
                event: "test event",
                era1: "",
                era2: "",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "",
            },
            {
                id: "oHSPSlkb7J5",
                incidentManagerUsername: "dev.user",
                creationDate: "2024-08-26 17:03:17.532",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Acute respiratory",
                event: "test event",
                era1: "",
                era2: "",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "",
            },
            {
                id: "g5C6Veut61t",
                incidentManagerUsername: "dev.user",
                creationDate: "2024-08-27 11:06:36.869",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Acute VHF",
                event: "test event",
                era1: "",
                era2: "",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "",
            },
        ]);
    }

    getAlertsPerformanceOverviewMetrics(): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return Future.success([
            {
                cases: "1",
                teiId: "n3zdthapNzC",
                deaths: "3",
                province: " ce Central Province ",
                orgUnit: "Central Province",
                orgUnitType: "Province",
                detect7d: "",
                duration: "158d",
                notify1d: "3",
                respond7d: "-2",
                eventEBSId: "",
                eventIBSId: "OUTBREAK_000005",
                incidentStatus: "Watch",
                incidentManager: "etst",
                suspectedDisease: "COVID19",
                nationalDiseaseOutbreakEventId: "tnhWg7zKmNF",
                date: "2024-08-27",
                eventSource: AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
            },
            {
                cases: "22",
                teiId: "ZJylQsTku6z",
                deaths: "1",
                province: " ce Central Province ",
                orgUnit: "Central Province",
                orgUnitType: "Province",
                detect7d: "",
                duration: "139d",
                notify1d: "1",
                respond7d: "-1",
                eventEBSId: "",
                eventIBSId: "OUTBREAK_000011",
                incidentStatus: "Watch",
                incidentManager: "Zebra Test 1",
                suspectedDisease: "COVID19",
                nationalDiseaseOutbreakEventId: "tnhWg7zKmNF",
                date: "2024-08-27",
                eventSource: AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
            },
            {
                cases: "5",
                teiId: "cOWooRCVHqa",
                deaths: "5",
                province: " ce Central Province ",
                orgUnit: "Central Province",
                orgUnitType: "Province",
                detect7d: "2",
                duration: "111d",
                notify1d: "1",
                respond7d: "-1",
                eventEBSId: "12345",
                eventIBSId: "",
                incidentStatus: "Alert",
                incidentManager: "Zebra Test 2",
                suspectedDisease: "Acute VHF",
                nationalDiseaseOutbreakEventId: "LALS50e9Zea",
                date: "2024-08-27",
                eventSource: AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
            },
        ]);
    }

    getMappedAlerts(_diseaseOutbreakId: Id): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return Future.success([
            {
                cases: "1",
                teiId: "n3zdthapNzC",
                deaths: "3",
                province: " ce Central Province ",
                orgUnit: "Central Province",
                orgUnitType: "Province",
                detect7d: "",
                duration: "158d",
                notify1d: "3",
                respond7d: "-2",
                eventEBSId: "",
                eventIBSId: "OUTBREAK_000005",
                incidentStatus: "Watch",
                incidentManager: "etst",
                suspectedDisease: "COVID19",
                nationalDiseaseOutbreakEventId: "tnhWg7zKmNF",
                date: "2024-08-27",
                eventSource: AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
            },
            {
                cases: "22",
                teiId: "ZJylQsTku6z",
                deaths: "1",
                province: " ce Central Province ",
                orgUnit: "Central Province",
                orgUnitType: "Province",
                detect7d: "",
                duration: "139d",
                notify1d: "1",
                respond7d: "-1",
                eventEBSId: "",
                eventIBSId: "OUTBREAK_000011",
                incidentStatus: "Watch",
                incidentManager: "Zebra Test 1",
                suspectedDisease: "COVID19",
                nationalDiseaseOutbreakEventId: "tnhWg7zKmNF",
                date: "2024-08-27",
                eventSource: AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
            },
            {
                cases: "5",
                teiId: "cOWooRCVHqa",
                deaths: "5",
                province: " ce Central Province ",
                orgUnit: "Central Province",
                orgUnitType: "Province",
                detect7d: "2",
                duration: "111d",
                notify1d: "1",
                respond7d: "-1",
                eventEBSId: "12345",
                eventIBSId: "",
                incidentStatus: "Alert",
                incidentManager: "Zebra Test 2",
                suspectedDisease: "Acute VHF",
                nationalDiseaseOutbreakEventId: "LALS50e9Zea",
                date: "2024-08-27",
                eventSource: AlertDataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
            },
        ]);
    }
}
