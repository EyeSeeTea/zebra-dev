import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    eventTrackerCountsIndicatorMap,
    INDICATORS_717_PERFORMANCE,
    IndicatorsId,
} from "./consts/PerformanceOverviewConstants";
import moment from "moment";
import {
    DiseaseOutbreakEventBaseAttrs,
    NationalIncidentStatus,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DataStoreClient } from "../DataStoreClient";
import {
    TotalCardCounts,
    HazardNames,
    PerformanceOverviewMetrics,
    DiseaseNames,
} from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { AlertSynchronizationData } from "../../domain/entities/alert/AlertData";
import { OrgUnit } from "../../domain/entities/OrgUnit";

export type Indicator717PerformanceBaseAttrs = {
    id: string;
    name: string;
    type: "count" | "percent";
    value: number;
};

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

const DEFAULT_END_DATE: string = formatDate(new Date());

const DEFAULT_START_DATE = "2000-01-01";

export class PerformanceOverviewD2Repository implements PerformanceOverviewRepository {
    constructor(private api: D2Api, private datastore: DataStoreClient) {}

    getTotalCardCounts(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>,
        dateRangeFilter?: string[]
    ): FutureData<TotalCardCounts[]> {
        return apiToFuture(
            this.api.analytics.get({
                dimension: [
                    `dx:${eventTrackerCountsIndicatorMap.map(({ id }) => id).join(";")}`,
                    `ou:${
                        multiSelectFilters && multiSelectFilters?.province?.length
                            ? multiSelectFilters.province.join(";")
                            : allProvincesIds.join(";")
                    }`,
                ],
                startDate:
                    dateRangeFilter?.length && dateRangeFilter[0]
                        ? dateRangeFilter[0]
                        : DEFAULT_START_DATE,
                endDate:
                    dateRangeFilter?.length && dateRangeFilter[1]
                        ? dateRangeFilter[1]
                        : DEFAULT_END_DATE,
                includeMetadataDetails: true,
            })
        ).map(analyticsResponse => {
            const totalCardCounts =
                this.mapAnalyticsRowsToTotalCardCounts(
                    analyticsResponse.rows,
                    singleSelectFilters
                ) || [];

            const uniqueTotalCardCounts = totalCardCounts.reduce((acc, totalCardCount) => {
                const existingEntry = acc[totalCardCount.name];

                if (existingEntry) {
                    existingEntry.total += totalCardCount.total;
                    acc[totalCardCount.name] = existingEntry;
                } else {
                    acc[totalCardCount.name] = totalCardCount;
                }
                return acc;
            }, {} as Record<string, TotalCardCounts>);

            return Object.values(uniqueTotalCardCounts);
        });
    }
    mapAnalyticsRowsToTotalCardCounts = (
        rowData: string[][],
        filters?: Record<string, string>
    ): TotalCardCounts[] => {
        const counts: TotalCardCounts[] = _(
            rowData.map(([id, _orgUnit, total]) => {
                const indicator = eventTrackerCountsIndicatorMap.find(d => d.id === id);
                if (!indicator || !total) {
                    return null;
                }

                if (indicator.type === "hazard") {
                    const hazardCount = {
                        id: id,
                        name: indicator.name,
                        type: indicator.type,
                        incidentStatus: indicator.incidentStatus,
                        total: parseFloat(total),
                    };
                    return hazardCount;
                } else {
                    const diseaseCount = {
                        id: id,
                        name: indicator.name,
                        type: indicator.type,
                        incidentStatus: indicator.incidentStatus,
                        total: parseFloat(total),
                    };
                    return diseaseCount;
                }
            })
        )
            .compact()
            .value();

        const filteredCounts: TotalCardCounts[] = counts.filter(item => {
            if (filters && Object.entries(filters).length) {
                return Object.entries(filters).every(([key, value]) => {
                    if (!value) {
                        return true;
                    }
                    if (key === "incidentStatus") {
                        return value === item.incidentStatus;
                    } else if (key === "disease" || key === "hazard") {
                        return value === item.name;
                    }
                });
            }
            return true;
        });
        return filteredCounts;
    };

    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]> {
        return apiToFuture(
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
        ).flatMap(indicatorsProgramFuture => {
            const mappedIndicators =
                indicatorsProgramFuture?.rows.map((row: string[]) =>
                    this.mapRowToBaseIndicator(
                        row,
                        indicatorsProgramFuture.headers,
                        indicatorsProgramFuture.metaData
                    )
                ) || [];

            const performanceOverviewMetrics = diseaseOutbreakEvents.map(event => {
                const baseIndicator = mappedIndicators.find(indicator => indicator.id === event.id);
                const key = baseIndicator?.suspectedDisease || baseIndicator?.hazardType;

                return this.getCasesAndDeathsFromDatastore(key).map(casesAndDeaths => {
                    const duration = `${moment()
                        .diff(moment(event.emerged.date), "days")
                        .toString()}d`;
                    if (!baseIndicator) {
                        return {
                            id: event.id,
                            event: event.name,
                            manager: event.incidentManagerName,
                            duration: duration,
                            nationalIncidentStatus: event.incidentStatus,
                            cases: casesAndDeaths.cases.toString(),
                            deaths: casesAndDeaths.deaths.toString(),
                        } as PerformanceOverviewMetrics;
                    }
                    return {
                        ...baseIndicator,
                        nationalIncidentStatus: event.incidentStatus,
                        manager: event.incidentManagerName,
                        duration: duration,
                        cases: casesAndDeaths.cases.toString(),
                        deaths: casesAndDeaths.deaths.toString(),
                    } as PerformanceOverviewMetrics;
                });
            });

            return Future.sequential(performanceOverviewMetrics);
        });
    }

    get717Performance(): FutureData<Indicator717PerformanceBaseAttrs[]> {
        const transformData = (
            data: string[][],
            indicators717Performance: typeof INDICATORS_717_PERFORMANCE
        ): Indicator717PerformanceBaseAttrs[] => {
            return data.flatMap(([id, , value]) => {
                const indicator = indicators717Performance.find(d => d.id === id);
                if (!indicator || !value) {
                    return [];
                }

                // Ensure the type is either 'count' or 'percent'
                const type: "count" | "percent" =
                    indicator.type === "count" || indicator.type === "percent"
                        ? indicator.type
                        : "count"; // Default to 'count' if type is not valid

                return [
                    {
                        ...indicator,
                        value: parseFloat(value),
                        type, // Set the valid type here with narrowed types
                    },
                ];
            });
        };

        return apiToFuture(
            this.api.analytics.get({
                dimension: [
                    `dx:${INDICATORS_717_PERFORMANCE.map(({ id }) => id).join(";")}`,
                    "pe:THIS_YEAR",
                ],
                includeMetadataDetails: true,
            })
        ).map(res => {
            return transformData(res.rows, INDICATORS_717_PERFORMANCE) || [];
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
        metaData: AnalyticsResponse["metaData"]
    ): Partial<PerformanceOverviewMetrics> {
        return headers.reduce((acc, header, index) => {
            const key = Object.keys(IndicatorsId).find(
                key => IndicatorsId[key as keyof typeof IndicatorsId] === header.name
            ) as Maybe<keyof PerformanceOverviewMetrics>;

            if (!key) return acc;

            if (key === "suspectedDisease") {
                acc[key] =
                    ((
                        Object.values(metaData.items).find(
                            item => (item as any).code === row[index]
                        ) as any
                    )?.name as DiseaseNames) || "";
            } else if (key === "hazardType") {
                acc[key] =
                    ((
                        Object.values(metaData.items).find(
                            item => (item as any).code === row[index]
                        ) as any
                    )?.name as HazardNames) || "";
            } else if (key === "nationalIncidentStatus") {
                acc[key] = row[index] as NationalIncidentStatus;
            } else {
                acc[key] = row[index] as (HazardNames & OrgUnit[]) | undefined;
            }

            return acc;
        }, {} as Partial<PerformanceOverviewMetrics>);
    }
}
