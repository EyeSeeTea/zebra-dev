import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    PERFORMANCE_METRICS_717_IDS,
    IndicatorsId,
    EVENT_TRACKER_717_IDS,
    EventTrackerCountIndicator,
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
    IncidentStatus,
} from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { OrgUnit } from "../../domain/entities/OrgUnit";
import { Id } from "../../domain/entities/Ref";
import { OverviewCard } from "../../domain/entities/PerformanceOverview";
import { assertOrError } from "./utils/AssertOrError";
import {
    getProgramIndicatorsFromDatastore,
    ProgramIndicatorsDatastore,
    ProgramIndicatorsDatastoreKey,
} from "./common/getProgramIndicatorsFromDatastore";

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

type IdValue = {
    id: Id;
    value: string;
};

export class PerformanceOverviewD2Repository implements PerformanceOverviewRepository {
    constructor(private api: D2Api, private datastore: DataStoreClient) {}

    getTotalCardCounts(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>,
        dateRangeFilter?: string[]
    ): FutureData<TotalCardCounts[]> {
        return getProgramIndicatorsFromDatastore(
            this.datastore,
            ProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts
        ).flatMap(activeVerifiedAlerts => {
            const eventTrackerCountsIndicatorMap =
                this.mapActiveVerfiedAlertsToEventTrackerCountIndicator(activeVerifiedAlerts);
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
                        eventTrackerCountsIndicatorMap,
                        analyticsResponse.rows,
                        singleSelectFilters
                    ) || [];

                const uniqueTotalCardCounts = totalCardCounts.reduce((acc, totalCardCount) => {
                    const existingEntry = acc[totalCardCount.name];

                    if (existingEntry) {
                        existingEntry.total += totalCardCount.total;
                        acc[totalCardCount.name] = existingEntry;
                    } else {
                        acc[totalCardCount.name] = { ...totalCardCount };
                    }
                    return acc;
                }, {} as Record<string, TotalCardCounts>);

                return Object.values(uniqueTotalCardCounts);
            });
        });
    }

    mapActiveVerfiedAlertsToEventTrackerCountIndicator(
        activeVerifiedAlerts: Maybe<ProgramIndicatorsDatastore[]>
    ): EventTrackerCountIndicator[] {
        if (!activeVerifiedAlerts) return [];
        return _(
            activeVerifiedAlerts.map(activeVerified => {
                if (activeVerified.disease === "ALL") return;

                if (activeVerified.disease) {
                    const eventTrackerCount: EventTrackerCountIndicator = {
                        id: activeVerified.id,
                        type: "disease",
                        name: activeVerified.disease as DiseaseNames,
                        incidentStatus: activeVerified.incidentStatus as IncidentStatus,
                    };
                    return eventTrackerCount;
                } else {
                    const eventTrackerCount: EventTrackerCountIndicator = {
                        id: activeVerified.id,
                        type: "hazard",
                        name: activeVerified.hazardType as HazardNames,
                        incidentStatus: activeVerified.incidentStatus as IncidentStatus,
                    };
                    return eventTrackerCount;
                }
            })
        )
            .compact()
            .value();
    }

    mapAnalyticsRowsToTotalCardCounts = (
        eventTrackerCountsIndicatorMap: EventTrackerCountIndicator[],
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
                const matchesDisease = !filters.disease || item.name === filters.disease;
                const matchesHazard = !filters.hazard || item.type === "hazard";
                const matchesIncidentStatus = !filters.incidentStatus
                    ? item.incidentStatus === "ALL"
                    : item.incidentStatus === filters.incidentStatus;

                return matchesDisease && matchesHazard && matchesIncidentStatus;
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
                                `Event Tracker Overview Ids for type ${type} not found in datastore`
                            )
                        );
                    return Future.success(currentEventTrackerOverviewId);
                });
            });
    }

    private getAllEventTrackerOverviewIdsFromDatastore(): FutureData<EventTrackerOverview[]> {
        return this.datastore
            .getObject<EventTrackerOverview[]>(EVENT_TRACKER_OVERVIEW_DATASTORE_KEY)
            .flatMap(nullableEventTrackerOverviewIds => {
                return assertOrError(
                    nullableEventTrackerOverviewIds,
                    EVENT_TRACKER_OVERVIEW_DATASTORE_KEY
                );
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
            return this.getAllEventTrackerOverviewIdsFromDatastore().flatMap(
                eventTrackerOverviews => {
                    const mappedIndicators =
                        indicatorsProgramFuture?.rows.map((row: string[]) =>
                            this.mapRowToBaseIndicator(
                                row,
                                indicatorsProgramFuture.headers,
                                indicatorsProgramFuture.metaData
                            )
                        ) || [];

                    const keys = _(
                        diseaseOutbreakEvents.map(
                            diseaseOutbreak =>
                                diseaseOutbreak.suspectedDiseaseCode || diseaseOutbreak.hazardType
                        )
                    )
                        .compact()
                        .uniq()
                        .value();

                    const eventTrackerOverviewsForKeys = eventTrackerOverviews.filter(overview =>
                        keys.includes(overview.key)
                    );

                    const casesIndicatorIds = eventTrackerOverviewsForKeys.map(
                        overview => overview.suspectedCasesId
                    );

                    const deathsIndicatorIds = eventTrackerOverviewsForKeys.map(
                        overview => overview.deathsId
                    );

                    return Future.joinObj({
                        allCases: this.getAnalyticsByIndicators(casesIndicatorIds),
                        allDeaths: this.getAnalyticsByIndicators(deathsIndicatorIds),
                    }).flatMap(({ allCases, allDeaths }) => {
                        const performanceOverviewMetrics: FutureData<PerformanceOverviewMetrics>[] =
                            diseaseOutbreakEvents.map(event => {
                                const baseIndicator = mappedIndicators.find(
                                    indicator => indicator.id === event.id
                                );

                                const key = event.hazardType || event.suspectedDiseaseCode;
                                if (!key)
                                    return Future.error(
                                        new Error(
                                            `No hazard type or suspected disease found for event : ${event.id}`
                                        )
                                    );
                                const currentEventTrackerOverview =
                                    eventTrackerOverviewsForKeys.find(
                                        overview => overview.key === key
                                    );

                                const currentCases = allCases.find(
                                    caseIdValue =>
                                        caseIdValue.id ===
                                        currentEventTrackerOverview?.suspectedCasesId
                                );

                                const currentDeaths = allDeaths.find(
                                    death => death.id === currentEventTrackerOverview?.deathsId
                                );

                                const duration = `${moment()
                                    .diff(moment(event.emerged.date), "days")
                                    .toString()}d`;

                                if (!baseIndicator) {
                                    const metrics = {
                                        id: event.id,
                                        event: event.name,
                                        manager: event.incidentManagerName,
                                        duration: duration,
                                        nationalIncidentStatus: event.incidentStatus,
                                        cases: currentCases?.value || "",
                                        deaths: currentDeaths?.value || "",
                                    } as PerformanceOverviewMetrics;
                                    return Future.success(metrics);
                                } else {
                                    const metrics = {
                                        ...baseIndicator,
                                        nationalIncidentStatus: event.incidentStatus,
                                        manager: event.incidentManagerName,
                                        duration: duration,
                                        cases: currentCases?.value || "",
                                        deaths: currentDeaths?.value || "",
                                    } as PerformanceOverviewMetrics;
                                    return Future.success(metrics);
                                }
                            });

                        return Future.sequential(performanceOverviewMetrics);
                    });
                }
            );
        });
    }

    private getAnalyticsByIndicators(ids: Id[]): FutureData<IdValue[]> {
        return apiToFuture(
            this.api.analytics.get({
                dimension: [`dx:${ids.join(";")}`],
                startDate: DEFAULT_START_DATE,
                endDate: DEFAULT_END_DATE,
                includeMetadataDetails: true,
            })
        ).flatMap(response => {
            const analytics = _(
                response.rows.map(row => {
                    if (row[0] && row[1]) return { id: row[0], value: parseInt(row[1]).toString() };
                })
            )
                .compact()
                .value();
            return Future.success(analytics);
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

                return {
                    ...indicator,
                    value: value ? parseFloat(value) : ("Inc" as const),
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
    const filteredRows = rows.filter(row => {
        const teiId = row[headers.findIndex(header => header.name === "tei")];
        return teiId === diseaseOutbreakEventId;
    })[0];

    return filteredRows;
}
