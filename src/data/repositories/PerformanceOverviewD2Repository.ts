import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    eventTrackerCountsIndicatorMap,
    PERFORMANCE_METRICS_717_IDS,
    IndicatorsId,
    EVENT_TRACKER_717_IDS,
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
    PerformanceMetrics717,
} from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { OrgUnit } from "../../domain/entities/OrgUnit";
import { AlertSynchronizationData } from "../../domain/entities/alert/AlertSynchronizationData";
import { Id } from "../../domain/entities/Ref";
import { OverviewCard } from "../../domain/entities/PerformanceOverview";
import { assertOrError } from "./utils/AssertOrError";

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

const DEFAULT_END_DATE: string = formatDate(new Date());
const DEFAULT_START_DATE = "2000-01-01";
const EVENT_TRACKER_OVERVIEW_DATASTORE_KEY = "event-tracker-overview-ids";

type EventTrackerOverview = {
    key: string;
    suspectedCasesId: Id;
    confirmedCasesId: Id;
    deathsId: Id;
    probableCasesId: Id;
};

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

    private getAnalyticsApi(caseId: string, startDate: string) {
        return apiToFuture(
            this.api.analytics.get({
                dimension: [`dx:${caseId}`],
                startDate: startDate,
                endDate: DEFAULT_END_DATE,
            })
        );
    }

    private getEventTrackerOverviewIdsFromDatastore(
        type: string
    ): FutureData<EventTrackerOverview> {
        return this.datastore
            .getObject<EventTrackerOverview[]>(EVENT_TRACKER_OVERVIEW_DATASTORE_KEY)
            .flatMap(nullableEventTrackerOverviewIds => {
                return assertOrError(
                    nullableEventTrackerOverviewIds,
                    EVENT_TRACKER_OVERVIEW_DATASTORE_KEY
                ).flatMap(eventTrackerOverviewIds => {
                    const currentEventTrackerOverviewId = eventTrackerOverviewIds?.find(
                        indicator => indicator.key === type
                    );

                    if (!currentEventTrackerOverviewId)
                        return Future.error(
                            new Error(
                                `Event Tracke Overview Ids for type ${type} not found in datastore`
                            )
                        );
                    return Future.success(currentEventTrackerOverviewId);
                });
            });
    }

    getEventTrackerOverviewMetrics(type: string): FutureData<OverviewCard[]> {
        return this.getEventTrackerOverviewIdsFromDatastore(type).flatMap(eventTrackerOverview => {
            const { suspectedCasesId, probableCasesId, confirmedCasesId, deathsId } =
                eventTrackerOverview;

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(new Date().getDate() - 7);

            return Future.joinObj(
                {
                    cumulativeSuspectedCases: this.getAnalyticsApi(
                        suspectedCasesId,
                        DEFAULT_START_DATE
                    ),
                    newSuspectedCases: this.getAnalyticsApi(
                        suspectedCasesId,
                        formatDate(sevenDaysAgo)
                    ),
                    cumulativeProbableCases: this.getAnalyticsApi(
                        probableCasesId,
                        DEFAULT_START_DATE
                    ),
                    newProbableCases: this.getAnalyticsApi(
                        probableCasesId,
                        formatDate(sevenDaysAgo)
                    ),
                    cumulativeConfirmedCases: this.getAnalyticsApi(
                        confirmedCasesId,
                        DEFAULT_START_DATE
                    ),
                    newConfirmedCases: this.getAnalyticsApi(
                        confirmedCasesId,
                        formatDate(sevenDaysAgo)
                    ),
                    cumulativeDeaths: this.getAnalyticsApi(deathsId, DEFAULT_START_DATE),
                    newDeaths: this.getAnalyticsApi(deathsId, formatDate(sevenDaysAgo)),
                },
                { concurrency: 5 }
            ).flatMap(
                ({
                    cumulativeSuspectedCases,
                    newSuspectedCases,
                    cumulativeProbableCases,
                    newProbableCases,
                    cumulativeConfirmedCases,
                    newConfirmedCases,
                    cumulativeDeaths,
                    newDeaths,
                }) => {
                    return Future.success([
                        {
                            name: "New Suspected Cases",
                            value: newSuspectedCases?.rows[0]?.[1]
                                ? parseInt(newSuspectedCases?.rows[0]?.[1])
                                : 0,
                        },
                        {
                            name: "New Probable Cases",
                            value: newProbableCases?.rows[0]?.[1]
                                ? parseInt(newProbableCases?.rows[0]?.[1])
                                : 0,
                        },
                        {
                            name: "New Confirmed Cases",
                            value: newConfirmedCases?.rows[0]?.[1]
                                ? parseInt(newConfirmedCases?.rows[0]?.[1])
                                : 0,
                        },
                        {
                            name: "New Deaths",
                            value: newDeaths?.rows[0]?.[1] ? parseInt(newDeaths?.rows[0]?.[1]) : 0,
                        },
                        {
                            name: "Cumulative Suspected Cases",
                            value: cumulativeSuspectedCases?.rows[0]?.[1]
                                ? parseInt(cumulativeSuspectedCases?.rows[0]?.[1])
                                : 0,
                        },
                        {
                            name: "Cumulative Probable Cases",
                            value: cumulativeProbableCases?.rows[0]?.[1]
                                ? parseInt(cumulativeProbableCases?.rows[0]?.[1])
                                : 0,
                        },
                        {
                            name: "Cumulative Confirmed Cases",
                            value: cumulativeConfirmedCases?.rows[0]?.[1]
                                ? parseInt(cumulativeConfirmedCases?.rows[0]?.[1])
                                : 0,
                        },
                        {
                            name: "Cumulative Deaths",
                            value: cumulativeDeaths?.rows[0]?.[1]
                                ? parseInt(cumulativeDeaths?.rows[0]?.[1])
                                : 0,
                        },
                    ]);
                }
            );
        });
    }

    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]> {
        return apiToFuture(
            this.api.analytics.getEnrollmentsQuery({
                programId: RTSL_ZEBRA_PROGRAM_ID,
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
                startDate: DEFAULT_START_DATE,
                endDate: DEFAULT_END_DATE,
            })
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

    private mapIndicatorsTo717PerformanceMetrics(
        performanceMetric717Response: string[][],
        metricIdList: PerformanceMetrics717[]
    ): PerformanceMetrics717[] {
        return _(
            performanceMetric717Response.map(([id, value]) => {
                const indicator = metricIdList.find(d => d.id === id);

                if (!indicator) throw new Error(`Unknown Indicator with id ${id} `);

                if (!value) {
                    return undefined;
                }
                return {
                    ...indicator,
                    value: parseFloat(value),
                    type: indicator.type,
                };
            })
        )
            .compact()
            .value();
    }

    getDashboard717Performance(): FutureData<PerformanceMetrics717[]> {
        return apiToFuture(
            this.api.analytics.get({
                dimension: [`dx:${PERFORMANCE_METRICS_717_IDS.map(({ id }) => id).join(";")}`],
                startDate: DEFAULT_START_DATE,
                endDate: DEFAULT_END_DATE,
                includeMetadataDetails: true,
            })
        ).map(res => {
            return this.mapIndicatorsTo717PerformanceMetrics(res.rows, PERFORMANCE_METRICS_717_IDS);
        });
    }

    getEventTracker717Performance(diseaseOutbreakEventId: Id): FutureData<PerformanceMetrics717[]> {
        return apiToFuture(
            this.api.analytics.getEnrollmentsQuery({
                programId: RTSL_ZEBRA_PROGRAM_ID,
                dimension: [...EVENT_TRACKER_717_IDS.map(({ id }) => id)],
                startDate: DEFAULT_START_DATE,
                endDate: DEFAULT_END_DATE,
            })
        ).flatMap(response => {
            const filteredRow = filterAnalyticsEnrollmentDataByDiseaseOutbreakEvent(
                diseaseOutbreakEventId,
                response.rows,
                response.headers
            );

            if (!filteredRow)
                return Future.error(new Error("No data found for event tracker 7-1-7 performance"));

            const mappedIndicatorsToRows: string[][] = EVENT_TRACKER_717_IDS.map(({ id }) => {
                return [
                    id,
                    filteredRow[response.headers.findIndex(header => header.name === id)] || "",
                ];
            });

            return Future.success(
                this.mapIndicatorsTo717PerformanceMetrics(
                    mappedIndicatorsToRows,
                    EVENT_TRACKER_717_IDS
                )
            );
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

function filterAnalyticsEnrollmentDataByDiseaseOutbreakEvent(
    diseaseOutbreakEventId: Id,
    rows: string[][],
    headers: { name: string; column: string }[]
): string[] | undefined {
    return rows.filter(row => {
        const teiId = row[headers.findIndex(header => header.name === "tei")];
        return teiId === diseaseOutbreakEventId;
    })[0];
}
