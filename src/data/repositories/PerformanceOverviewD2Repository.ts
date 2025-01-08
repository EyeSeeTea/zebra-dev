import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ALERTS_VERIFICATION_STATUS_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "./consts/DiseaseOutbreakConstants";
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
    PerformanceMetrics717Key,
} from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../../domain/entities/Ref";
import { OverviewCard } from "../../domain/entities/PerformanceOverview";
import { assertOrError } from "./utils/AssertOrError";
import {
    getProgramIndicatorsFromDatastore,
    ProgramIndicatorsDatastore,
    ProgramIndicatorsDatastoreKey,
} from "./common/getProgramIndicatorsFromDatastore";
import { AlertsPerformanceOverviewMetrics } from "../../domain/entities/alert/AlertsPerformanceOverviewMetrics";
import {
    AlertsPerformanceOverviewDimensions,
    AlertsPerformanceOverviewDimensionsKey,
    AlertsPerformanceOverviewDimensionsValue,
} from "./consts/AlertsPerformanceOverviewConstants";
import { orgUnitLevelTypeByLevelNumber } from "../../domain/entities/OrgUnit";

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
const NATIONAL_PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY =
    "national-717-performance-program-indicators";
const EVENT_TRACKER_PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY =
    "event-tracker-717-performance-program-indicators";
const ALERTS_PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY =
    "alerts-717-performance-program-indicators";
const PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY = "performance-overview-dimensions";
const ALERTS_PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY =
    "alerts-performance-overview-dimensions";

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
                const matchesDisease =
                    !filters.disease || (item.type === "disease" && item.name === filters.disease);
                const matchesHazard =
                    !filters.hazard || (item.type === "hazard" && item.name === filters.hazard);
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

    getNationalPerformanceOverviewMetrics(
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
                                                    overview =>
                                                        overview.key === key &&
                                                        overview.casesDataSource ===
                                                            event.casesDataSource
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

    getAlertsPerformanceOverviewMetrics(): FutureData<AlertsPerformanceOverviewMetrics[]> {
        return this.datastore
            .getObject<AlertsPerformanceOverviewDimensions>(
                ALERTS_PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY
            )
            .flatMap(nullablePerformanceOverviewDimensions => {
                return assertOrError(
                    nullablePerformanceOverviewDimensions,
                    ALERTS_PERFORMANCE_OVERVIEW_DIMENSIONS_DATASTORE_KEY
                ).flatMap(performanceOverviewDimensions => {
                    return apiToFuture(
                        this.api.get<AnalyticsResponse>(
                            `/analytics/enrollments/query/${RTSL_ZEBRA_ALERTS_PROGRAM_ID}`,
                            {
                                dimension: [
                                    performanceOverviewDimensions.eventEBSId,
                                    performanceOverviewDimensions.eventIBSId,
                                    performanceOverviewDimensions.nationalDiseaseOutbreakEventId,
                                    performanceOverviewDimensions.hazardType,
                                    performanceOverviewDimensions.suspectedDisease,
                                    performanceOverviewDimensions.cases,
                                    performanceOverviewDimensions.deaths,
                                    performanceOverviewDimensions.notify1d,
                                    performanceOverviewDimensions.detect7d,
                                    performanceOverviewDimensions.incidentManager,
                                    performanceOverviewDimensions.respond7d,
                                    performanceOverviewDimensions.incidentStatus,
                                    performanceOverviewDimensions.emergedDate,
                                ],
                                startDate: DEFAULT_START_DATE,
                                endDate: DEFAULT_END_DATE,
                                paging: false,
                                programStatus: "ACTIVE",
                                filter: `${RTSL_ZEBRA_ALERTS_VERIFICATION_STATUS_ID}:eq:RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED`,
                            }
                        )
                    ).flatMap(response => {
                        const mappedIndicators: AlertsPerformanceOverviewMetrics[] =
                            response.rows.map((row: string[]) => {
                                return Object.keys(performanceOverviewDimensions).reduce(
                                    (acc, dimensionKey) => {
                                        const dimension: AlertsPerformanceOverviewDimensionsValue =
                                            performanceOverviewDimensions[
                                                dimensionKey as AlertsPerformanceOverviewDimensionsKey
                                            ];

                                        const index = response.headers.findIndex(
                                            header => header.name === dimension
                                        );
                                        if (dimension === "enrollmentdate") {
                                            const inputDate = row[index];
                                            const formattedDate = inputDate?.split(" ")[0]; // YYYY-MM-DD
                                            return {
                                                ...acc,
                                                [dimensionKey]: formattedDate,
                                            };
                                        } else if (dimensionKey === "emergedDate") {
                                            const duration = row[index]
                                                ? `${moment()
                                                      .diff(moment(row[index]), "days")
                                                      .toString()}d`
                                                : "";

                                            return {
                                                ...acc,
                                                duration: duration,
                                            };
                                        } else if (dimension === "ounamehierarchy") {
                                            const hierarchyArray = row[index]?.split("/");
                                            return {
                                                ...acc,
                                                province:
                                                    (hierarchyArray && hierarchyArray.length > 1
                                                        ? hierarchyArray[1]
                                                        : row[index]) || "",
                                                orgUnitType:
                                                    hierarchyArray && hierarchyArray.length > 0
                                                        ? orgUnitLevelTypeByLevelNumber[
                                                              hierarchyArray.length
                                                          ] || "National"
                                                        : "National",
                                            };
                                        } else {
                                            const nameValue = Object.values(
                                                response.metaData.items
                                            ).find(item => item.code === row[index])?.name;

                                            return {
                                                ...acc,
                                                [dimensionKey]: nameValue || row[index],
                                            };
                                        }
                                    },
                                    {} as AlertsPerformanceOverviewMetrics
                                );
                            });

                        return Future.success(mappedIndicators);
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

    getNational717Performance(): FutureData<PerformanceMetrics717[]> {
        return this.get717PerformanceIndicators("national").flatMap(
            performance717ProgramIndicators => {
                return apiToFuture(
                    this.api.analytics.get({
                        dimension: [
                            `dx:${performance717ProgramIndicators.map(({ id }) => id).join(";")}`,
                        ],
                        startDate: DEFAULT_START_DATE,
                        endDate: DEFAULT_END_DATE,
                        includeMetadataDetails: true,
                    })
                ).map(res => {
                    return this.mapIndicatorsTo717PerformanceMetrics(
                        res.rows,
                        performance717ProgramIndicators
                    );
                });
            }
        );
    }

    getAlerts717Performance(): FutureData<PerformanceMetrics717[]> {
        return this.get717PerformanceIndicators("alerts").flatMap(
            performance717ProgramIndicators => {
                return apiToFuture(
                    this.api.analytics.get({
                        dimension: [
                            `dx:${performance717ProgramIndicators.map(({ id }) => id).join(";")}`,
                        ],
                        startDate: DEFAULT_START_DATE,
                        endDate: DEFAULT_END_DATE,
                        includeMetadataDetails: true,
                    })
                ).map(res => {
                    return this.mapIndicatorsTo717PerformanceMetrics(
                        res.rows,
                        performance717ProgramIndicators
                    );
                });
            }
        );
    }

    getEvent717Performance(diseaseOutbreakEventId: Id): FutureData<PerformanceMetrics717[]> {
        return this.get717PerformanceIndicators("event").flatMap(
            performance717ProgramIndicators => {
                return apiToFuture(
                    this.api.analytics.getEnrollmentsQuery({
                        programId: RTSL_ZEBRA_PROGRAM_ID,
                        dimension: [...performance717ProgramIndicators.map(({ id }) => id)],
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

                    const mappedIndicatorsToRows: string[][] = performance717ProgramIndicators.map(
                        ({ id }) => {
                            return [
                                id,
                                filteredRow[
                                    response.headers.findIndex(header => header.name === id)
                                ] || "",
                            ];
                        }
                    );

                    return Future.success(
                        this.mapIndicatorsTo717PerformanceMetrics(
                            mappedIndicatorsToRows,
                            performance717ProgramIndicators
                        )
                    );
                });
            }
        );
    }

    private get717PerformanceIndicators(
        key: PerformanceMetrics717Key
    ): FutureData<PerformanceMetrics717[]> {
        const datastoreKey =
            key === "national"
                ? NATIONAL_PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY
                : key === "alerts"
                ? ALERTS_PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY
                : EVENT_TRACKER_PERFORMANCE_717_PROGRAM_INDICATORS_DATASTORE_KEY;

        return this.datastore
            .getObject<PerformanceMetrics717[]>(datastoreKey)
            .flatMap(nullable717PerformanceProgramIndicators => {
                return assertOrError(nullable717PerformanceProgramIndicators, datastoreKey).flatMap(
                    performance717ProgramIndicators => {
                        return Future.success(performance717ProgramIndicators);
                    }
                );
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

                case "date": {
                    const inputDate = row[index];
                    const formattedDate = inputDate?.split(" ")[0]; // YYYY-MM-DD
                    acc.date = formattedDate;
                    break;
                }
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
