import { Maybe } from "./../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { AnalyticsRepository } from "../../domain/repositories/AnalyticsRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import { IndicatorsId, NB_OF_ACTIVE_VERIFIED } from "./consts/AnalyticsConstants";
import moment from "moment";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DataStoreClient } from "../DataStoreClient";
import { Id } from "../../domain/entities/Ref";

//TO DO : Remove once merged with mapping code.
export type AlertSynchronizationData = {
    lastSyncTime: string;
    type: string;
    nationalDiseaseOutbreakEventId: Id;
    alerts: {
        alertId: string;
        eventDate: Maybe<string>;
        orgUnit: Maybe<string>;
        suspectedCases: string;
        probableCases: string;
        confirmedCases: string;
        deaths: string;
    }[];
} & {
    [key in "disease" | "hazard"]?: string;
};

export type ProgramIndicatorBaseAttrs = {
    id: string;
    event: string;
    province: string;
    duration: string;
    manager: string;
    cases: string;
    deaths: string;
    era1: string;
    era2: string;
    era3: string;
    era4: string;
    era5: string;
    era6: string;
    era7: string;
    detect7d: string;
    notify1d: string;
    respond7d: string;
    creationDate: string;
    suspectedDisease: string;
    hazardType: string;
    eventDetectionDate: string;
};

interface DiseaseEntry {
    disease: string;
    total: number;
}

interface HazardEntry {
    hazard: string;
    total: number;
}

export type DiseaseTotalAttrs = DiseaseEntry | HazardEntry;

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api, private datastore: DataStoreClient) {}

    getDiseasesTotal(filters?: Record<string, string[]>): FutureData<DiseaseTotalAttrs[]> {
        const transformData = (data: string[][], activeVerified: typeof NB_OF_ACTIVE_VERIFIED) => {
            return data
                .flatMap(([id, , total]) => {
                    const indicator = activeVerified.find(d => d.id === id);
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

        const fetchCasesAnalytics = (): FutureData<AnalyticsResponse> =>
            apiToFuture(
                this.api.analytics.get({
                    dimension: [
                        `dx:${NB_OF_ACTIVE_VERIFIED.map(({ id }) => id).join(";")}`,
                        "pe:THIS_YEAR",
                    ],
                    includeMetadataDetails: true,
                })
            );
        return fetchCasesAnalytics().map(res => {
            const rows = transformData(res.rows, NB_OF_ACTIVE_VERIFIED) || [];

            return Object.values(
                rows.reduce((acc, { disease, hazard, total }) => {
                    const name = (disease || hazard) as string;
                    if (!name) {
                        return acc;
                    }

                    const existingEntry =
                        acc[name] ||
                        (disease
                            ? { disease: disease as string, total: 0 }
                            : { hazard: hazard as string, total: 0 });

                    existingEntry.total += total;
                    acc[name] = existingEntry;
                    return acc;
                }, {} as Record<string, DiseaseEntry | HazardEntry>)
            );
        });
    }

    getProgramIndicators(
        diseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
    ): FutureData<ProgramIndicatorBaseAttrs[]> {
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
                        } as ProgramIndicatorBaseAttrs;
                    }
                    return {
                        ...baseIndicator,
                        manager: event.incidentManagerName,
                        cases: casesAndDeaths.cases.toString(),
                        deaths: casesAndDeaths.deaths.toString(),
                    } as ProgramIndicatorBaseAttrs;
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
        metaData: AnalyticsResponse["metaData"]
    ): Partial<ProgramIndicatorBaseAttrs> {
        return headers.reduce((acc, header, index) => {
            const key = Object.keys(IndicatorsId).find(
                key => IndicatorsId[key as keyof typeof IndicatorsId] === header.name
            ) as Maybe<keyof ProgramIndicatorBaseAttrs>;

            if (!key) return acc;

            if (key === "suspectedDisease") {
                acc[key] =
                    Object.values(metaData.items).find(item => item.code === row[index])?.name ||
                    "";
            } else if (key === "hazardType") {
                acc[key] =
                    Object.values(metaData.items).find(item => item.code === row[index])?.name ||
                    "";
            } else if (key === "eventDetectionDate") {
                acc.duration = `${moment().diff(moment(row[index]), "days").toString()}d`;
                acc[key] = moment(row[index]).format("YYYY-MM-DD");
            } else {
                acc[key] = row[index] || "";
            }

            return acc;
        }, {} as Partial<ProgramIndicatorBaseAttrs>);
    }
}
