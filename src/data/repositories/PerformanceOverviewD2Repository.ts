import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import { EvenTrackerCountsIndicatorMap, IndicatorsId } from "./consts/PerformanceOverviewConstants";
import moment from "moment";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DataStoreClient } from "../DataStoreClient";
import {
    DiseaseNames,
    EventTrackerCounts,
    HazardNames,
    PerformanceOverviewMetrics,
} from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { AlertSynchronizationData } from "../../domain/entities/alert/AlertData";
import { OrgUnit } from "../../domain/entities/OrgUnit";

export class PerformanceOverviewD2Repository implements PerformanceOverviewRepository {
    constructor(private api: D2Api, private datastore: DataStoreClient) {}

    getDiseasesTotal(filters?: Record<string, string[]>): FutureData<EventTrackerCounts[]> {
        const transformData = (data: string[][]) => {
            return data
                .flatMap(([id, _period, _orgUnit, total]) => {
                    const indicator = EvenTrackerCountsIndicatorMap.find(d => d.id === id);
                    if (!indicator || !total) {
                        return [];
                    }
                    return [
                        {
                            id,
                            [indicator.type]: indicator.name,
                            incidentStatus: indicator.incidentStatus,
                            total: parseFloat(total),
                        },
                    ];
                })
                .filter(item => {
                    if (!item) {
                        return false;
                    }
                    if (filters) {
                        return Object.entries(filters).every(([key, values]) => {
                            if (!values.length) {
                                return true;
                            }
                            if (item[key as keyof typeof item]) {
                                return values.includes(item[key as keyof typeof item] as string);
                            }
                        });
                    }
                    return true;
                });
        };

        const fetchActiveVerifiedAnalytics = (): FutureData<AnalyticsResponse> =>
            apiToFuture(
                this.api.analytics.get({
                    dimension: [
                        `dx:${EvenTrackerCountsIndicatorMap.map(({ id }) => id).join(";")}`,
                        "ou:LEVEL-2",
                        "pe:THIS_YEAR",
                    ],
                    includeMetadataDetails: true,
                })
            );
        return fetchActiveVerifiedAnalytics().map(res => {
            const rows = transformData(res.rows) || [];

            return Object.values(
                rows.reduce((acc, { disease, hazard, total }) => {
                    const name = (disease || hazard) as string;
                    if (!name) {
                        return acc;
                    }

                    const existingEntry =
                        acc[name] ||
                        (disease
                            ? { name: disease as DiseaseNames, type: "disease", total: 0 }
                            : { name: hazard as HazardNames, type: "hazard", total: 0 });

                    existingEntry.total += total;
                    acc[name] = existingEntry;
                    return acc;
                }, {} as Record<string, EventTrackerCounts>)
            );
        });
    }

    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]> {
        const fetchEnrollmentsQuery = (): FutureData<AnalyticsResponse> =>
            apiToFuture(
                this.api.get<AnalyticsResponse>(
                    `/analytics/enrollments/query/${RTSL_ZEBRA_PROGRAM_ID}`,
                    {
                        enrollmentDate: "LAST_12_MONTHS,THIS_MONTH",
                        dimension: [
                            IndicatorsId.suspectedDisease,
                            IndicatorsId.hazardType,
                            IndicatorsId.event,
                            IndicatorsId.era1,
                            IndicatorsId.era2,
                            IndicatorsId.era3,
                            IndicatorsId.era4,
                            IndicatorsId.era5,
                            IndicatorsId.era6,
                            IndicatorsId.era7,
                            IndicatorsId.detect7d,
                            IndicatorsId.notify1d,
                            IndicatorsId.respond7d,
                        ],
                    }
                )
            );

        return fetchEnrollmentsQuery().flatMap(indicatorsProgramFuture => {
            const mappedIndicators =
                indicatorsProgramFuture?.rows.map((row: string[]) =>
                    this.mapRowToBaseIndicator(
                        row,
                        indicatorsProgramFuture.headers,
                        //@ts-ignore
                        indicatorsProgramFuture.metaData
                    )
                ) || [];

            const something = diseaseOutbreakEvents.map(event => {
                const baseIndicator = mappedIndicators.find(indicator => indicator.id === event.id);

                const key = baseIndicator?.suspectedDisease || baseIndicator?.hazardType;

                return this.getCasesAndDeathsFromDatastore(key).map(casesAndDeaths => {
                    if (!baseIndicator) {
                        return {
                            id: event.id,
                            event: event.name,
                            manager: event.incidentManagerName,
                            cases: casesAndDeaths.cases.toString(),
                            deaths: casesAndDeaths.deaths.toString(),
                        } as PerformanceOverviewMetrics;
                    }
                    return {
                        ...baseIndicator,
                        manager: event.incidentManagerName,
                        cases: casesAndDeaths.cases.toString(),
                        deaths: casesAndDeaths.deaths.toString(),
                    } as PerformanceOverviewMetrics;
                });
            });

            return Future.sequential(something);
        });
    }

    private getCasesAndDeathsFromDatastore(
        key: string | undefined
    ): FutureData<{ cases: number; deaths: number }> {
        if (!key) return Future.success({ cases: 0, deaths: 0 });
        return this.datastore.getObject<AlertSynchronizationData>(key).flatMap(data => {
            if (!data) return Future.success({ cases: 0, deaths: 0 });
            const casesDeaths = data.alerts.reduce(
                (acc, alert) => {
                    acc.cases += parseInt(alert.suspectedCases) || 0;
                    acc.deaths += parseInt(alert.deaths) || 0;
                    return acc;
                },
                { cases: 0, deaths: 0 }
            );

            return Future.success(casesDeaths);
        });
    }

    private mapRowToBaseIndicator(
        row: string[],
        headers: { name: string; column: string }[],
        //@ts-ignore
        metaData: AnalyticsResponse["metaData"]
    ): Partial<PerformanceOverviewMetrics> {
        return headers.reduce((acc, header, index) => {
            const key = Object.keys(IndicatorsId).find(
                key => IndicatorsId[key as keyof typeof IndicatorsId] === header.name
            ) as Maybe<keyof PerformanceOverviewMetrics>;

            if (!key) return acc;

            if (key === "suspectedDisease") {
                acc[key] =
                    //@ts-ignore
                    Object.values(metaData.items).find(item => item.code === row[index])?.name ||
                    "";
            } else if (key === "hazardType") {
                acc[key] =
                    //@ts-ignore
                    Object.values(metaData.items).find(item => item.code === row[index])?.name ||
                    "";
            }
            //@ts-ignore
            else if (key === "eventDetectionDate") {
                acc.duration = `${moment().diff(moment(row[index]), "days").toString()}d`;
                //@ts-ignore
                acc[key] = moment(row[index]).format("YYYY-MM-DD");
            } else {
                acc[key] = row[index] as (HazardNames & OrgUnit[]) | undefined;
            }

            return acc;
        }, {} as Partial<PerformanceOverviewMetrics>);
    }

    private isSuspectedDisease(
        name:
            | PerformanceOverviewMetrics["suspectedDisease"]
            | PerformanceOverviewMetrics["hazardType"]
    ): name is PerformanceOverviewMetrics["suspectedDisease"] {
        const suspectedDiseases: PerformanceOverviewMetrics["suspectedDisease"][] = [
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
        ];

        return suspectedDiseases.includes(name as PerformanceOverviewMetrics["suspectedDisease"]);
    }
}
