import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    EventTrackerCountIndicator,
    PerformanceOverviewDimensions,
} from "./consts/PerformanceOverviewConstants";
import moment from "moment";
import {
    CasesDataSource,
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

const ALERTS_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY =
    "alerts-program-event-tracker-overview-ids";
const CASES_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY =
    "cases-program-event-tracker-overview-ids";
const PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY = "717-performance-program-indicators";
const PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY = "performance-overview-dimensions";

type EventTrackerOverviewInDataStore = {
    key: string;
    suspectedCasesId: Id;
    confirmedCasesId: Id;
    deathsId: Id;
    probableCasesId: Id;
};

type EventTrackerOverview = EventTrackerOverviewInDataStore & {
    casesDataSource: CasesDataSource;
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
                        acc[totalCardCount.name] = totalCardCount;
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
        type: string,
        casesDataSource: CasesDataSource
    ): FutureData<EventTrackerOverview> {
        const datastoreKey =
            casesDataSource === CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF
                ? CASES_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY
                : ALERTS_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY;

        return this.datastore
            .getObject<EventTrackerOverviewInDataStore[]>(datastoreKey)
            .flatMap(nullableEventTrackerOverviewIds => {
                return assertOrError(nullableEventTrackerOverviewIds, datastoreKey).flatMap(
                    eventTrackerOverviewIds => {
                        const currentEventTrackerOverviewId = eventTrackerOverviewIds?.find(
                            indicator => indicator.key === type
                        );

                        if (!currentEventTrackerOverviewId)
                            return Future.error(
                                new Error(
                                    `Event Tracker Overview Ids for type ${type} not found in datastore`
                                )
                            );
                        return Future.success({
                            ...currentEventTrackerOverviewId,
                            casesDataSource: casesDataSource,
                        });
                    }
                );
            });
    }

    private getAllEventTrackerOverviewIdsFromDatastore(): FutureData<EventTrackerOverview[]> {
        return Future.joinObj({
            alertsEventTrackerOverviewIdsResponse: this.datastore.getObject<
                EventTrackerOverviewInDataStore[]
            >(ALERTS_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY),
            casesEventTrackerOverviewIdsResponse: this.datastore.getObject<
                EventTrackerOverviewInDataStore[]
            >(CASES_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY),
        }).flatMap(
            ({ alertsEventTrackerOverviewIdsResponse, casesEventTrackerOverviewIdsResponse }) => {
                return assertOrError(
                    alertsEventTrackerOverviewIdsResponse,
                    ALERTS_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY
                ).flatMap(alertsEventTrackerOverviewIds => {
                    return assertOrError(
                        casesEventTrackerOverviewIdsResponse,
                        CASES_PROGRAM_EVENT_TRACKER_OVERVIEW_DATASTORE_KEY
                    ).flatMap(casesEventTrackerOverviewIds => {
                        return Future.success([
                            ...alertsEventTrackerOverviewIds.map(
                                ({
                                    key,
                                    suspectedCasesId,
                                    confirmedCasesId,
                                    deathsId,
                                    probableCasesId,
                                }) => ({
                                    key,
                                    suspectedCasesId,
                                    confirmedCasesId,
                                    deathsId,
                                    probableCasesId,
                                    casesDataSource:
                                        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
                                })
                            ),
                            ...casesEventTrackerOverviewIds.map(
                                ({
                                    key,
                                    suspectedCasesId,
                                    confirmedCasesId,
                                    deathsId,
                                    probableCasesId,
                                }) => ({
                                    key,
                                    suspectedCasesId,
                                    confirmedCasesId,
                                    deathsId,
                                    probableCasesId,
                                    casesDataSource:
                                        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF,
                                })
                            ),
                        ]);
                    });
                });
            }
        );
    }

    getEventTrackerOverviewMetrics(
        type: string,
        casesDataSource: CasesDataSource
    ): FutureData<OverviewCard[]> {
        return this.getEventTrackerOverviewIdsFromDatastore(type, casesDataSource).flatMap(
            eventTrackerOverview => {
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
                                value: newDeaths?.rows[0]?.[1]
                                    ? parseInt(newDeaths?.rows[0]?.[1])
                                    : 0,
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
            }
        );
    }

    getPerformanceOverviewMetrics(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<PerformanceOverviewMetrics[]> {
        return this.datastore
            .getObject<PerformanceOverviewDimensions>(PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY)
            .flatMap(nullablePerformanceOverviewDimensions => {
                return assertOrError(
                    nullablePerformanceOverviewDimensions,
                    PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY
                ).flatMap(performanceOverviewDimensions => {
                    return apiToFuture(
                        this.api.analytics.getEnrollmentsQuery({
                            programId: RTSL_ZEBRA_PROGRAM_ID,
                            dimension: [
                                performanceOverviewDimensions.suspectedDisease,
                                performanceOverviewDimensions.hazardType,
                                performanceOverviewDimensions.event,
                                performanceOverviewDimensions.era1ProgramIndicator,
                                performanceOverviewDimensions.era2ProgramIndicator,
                                performanceOverviewDimensions.era3ProgramIndicator,
                                performanceOverviewDimensions.era4ProgramIndicator,
                                performanceOverviewDimensions.era5ProgramIndicator,
                                performanceOverviewDimensions.era6ProgramIndicator,
                                performanceOverviewDimensions.era7ProgramIndicator,
                                performanceOverviewDimensions.detect7dProgramIndicator,
                                performanceOverviewDimensions.notify1dProgramIndicator,
                                performanceOverviewDimensions.respond7dProgramIndicator,
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
                                            indicatorsProgramFuture.metaData,
                                            performanceOverviewDimensions
                                        )
                                    ) || [];

                                const keys = _(
                                    diseaseOutbreakEvents.map(
                                        diseaseOutbreak =>
                                            diseaseOutbreak.suspectedDiseaseCode ||
                                            diseaseOutbreak.hazardType
                                    )
                                )
                                    .compact()
                                    .uniq()
                                    .value();

                                const eventTrackerOverviewsForKeys = eventTrackerOverviews.filter(
                                    overview => keys.includes(overview.key)
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

                                            const key =
                                                event.hazardType || event.suspectedDiseaseCode;
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
                                                death =>
                                                    death.id ===
                                                    currentEventTrackerOverview?.deathsId
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
                });
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
        return this.datastore
            .getObject<PerformanceMetrics717[]>(PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY)
            .flatMap(nullable717PerformanceProgramIndicators => {
                return assertOrError(
                    nullable717PerformanceProgramIndicators,
                    PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY
                ).flatMap(performance717ProgramIndicators => {
                    const dashboard717PerformanceIndicator = performance717ProgramIndicators.filter(
                        indicator => indicator.key === "dashboard"
                    );
                    return apiToFuture(
                        this.api.analytics.get({
                            dimension: [
                                `dx:${dashboard717PerformanceIndicator
                                    .map(({ id }) => id)
                                    .join(";")}`,
                            ],
                            startDate: DEFAULT_START_DATE,
                            endDate: DEFAULT_END_DATE,
                            includeMetadataDetails: true,
                        })
                    ).map(res => {
                        return this.mapIndicatorsTo717PerformanceMetrics(
                            res.rows,
                            dashboard717PerformanceIndicator
                        );
                    });
                });
            });
    }

    getEventTracker717Performance(diseaseOutbreakEventId: Id): FutureData<PerformanceMetrics717[]> {
        return this.datastore
            .getObject<PerformanceMetrics717[]>(PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY)
            .flatMap(nullable717PerformanceProgramIndicators => {
                return assertOrError(
                    nullable717PerformanceProgramIndicators,
                    PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY
                ).flatMap(performance717ProgramIndicators => {
                    const eventTracker717PerformanceIndicator =
                        performance717ProgramIndicators.filter(
                            indicator => indicator.key === "event_tracker"
                        );
                    return apiToFuture(
                        this.api.analytics.getEnrollmentsQuery({
                            programId: RTSL_ZEBRA_PROGRAM_ID,
                            dimension: [...eventTracker717PerformanceIndicator.map(({ id }) => id)],
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
                            return Future.error(
                                new Error("No data found for event tracker 7-1-7 performance")
                            );

                        const mappedIndicatorsToRows: string[][] =
                            eventTracker717PerformanceIndicator.map(({ id }) => {
                                return [
                                    id,
                                    filteredRow[
                                        response.headers.findIndex(header => header.name === id)
                                    ] || "",
                                ];
                            });

                        return Future.success(
                            this.mapIndicatorsTo717PerformanceMetrics(
                                mappedIndicatorsToRows,
                                eventTracker717PerformanceIndicator
                            )
                        );
                    });
                });
            });
    }

    private mapRowToBaseIndicator(
        row: string[],
        headers: { name: string; column: string }[],
        metaData: AnalyticsResponse["metaData"],
        performanceOverviewDimensions: PerformanceOverviewDimensions
    ): Partial<PerformanceOverviewMetrics> {
        return headers.reduce((acc, header, index) => {
            const key = Object.keys(performanceOverviewDimensions).find(
                key =>
                    performanceOverviewDimensions[key as keyof PerformanceOverviewDimensions] ===
                    header.name
            ) as Maybe<keyof PerformanceOverviewDimensions>;

            if (!key) return acc;

            switch (key) {
                case "suspectedDisease":
                    acc.suspectedDisease =
                        ((
                            Object.values(metaData.items).find(
                                item => (item as any).code === row[index]
                            ) as any
                        )?.name as DiseaseNames) || "";
                    break;

                case "hazardType":
                    acc.hazardType =
                        ((
                            Object.values(metaData.items).find(
                                item => (item as any).code === row[index]
                            ) as any
                        )?.name as HazardNames) || "";
                    break;

                case "nationalIncidentStatus":
                    acc.nationalIncidentStatus = row[index] as NationalIncidentStatus;
                    break;

                case "teiId":
                    acc.id = row[index];
                    break;

                case "era1ProgramIndicator":
                    acc.era1 = row[index];
                    break;

                case "era2ProgramIndicator":
                    acc.era2 = row[index];
                    break;

                case "era3ProgramIndicator":
                    acc.era3 = row[index];
                    break;

                case "era4ProgramIndicator":
                    acc.era4 = row[index];
                    break;

                case "era5ProgramIndicator":
                    acc.era5 = row[index];
                    break;

                case "era6ProgramIndicator":
                    acc.era6 = row[index];
                    break;

                case "era7ProgramIndicator":
                    acc.era7 = row[index];
                    break;

                case "detect7dProgramIndicator":
                    acc.detect7d = row[index];
                    break;

                case "notify1dProgramIndicator":
                    acc.notify1d = row[index];
                    break;

                case "respond7dProgramIndicator":
                    acc.respond7d = row[index];
                    break;

                default:
                    acc[key] = row[index];
                    break;
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
