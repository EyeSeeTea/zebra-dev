// @ts-nocheck
import { Maybe } from "./../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { AnalyticsRepository } from "../../domain/repositories/AnalyticsRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";
import {
    IndicatorsId,
    NB_OF_ACTIVE_VERIFIED,
    NB_OF_CASES,
    NB_OF_DEATHS,
} from "./consts/AnalyticsConstants";
import moment from "moment";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

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

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

const DEFAULT_END_DATE: string = formatDate(new Date());

const DEFAULT_START_DATE = "2000-01-01";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api) {}

    getDiseasesTotal(
        allProvincesIds: string[],
        singleSelectFilters?: Record<string, string>,
        multiSelectFilters?: Record<string, string[]>
    ): FutureData<any> {
        const transformData = (data: string[][], activeVerified: typeof NB_OF_ACTIVE_VERIFIED) => {
            return data
                .flatMap(([id, _orgUnit, total]) => {
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
                    if (singleSelectFilters) {
                        return Object.entries(singleSelectFilters).every(([key, value]) => {
                            if (!value) {
                                return true;
                            }
                            if (item[key as keyof typeof item]) {
                                return value === (item[key as keyof typeof item] as string);
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
                        `ou:${
                            multiSelectFilters && multiSelectFilters?.province?.length
                                ? multiSelectFilters.province.join(";")
                                : allProvincesIds.join(";")
                        }`,
                    ],
                    startDate:
                        multiSelectFilters?.duration?.length && multiSelectFilters?.duration[0]
                            ? multiSelectFilters?.duration[0]
                            : DEFAULT_START_DATE,
                    endDate:
                        multiSelectFilters?.duration?.length && multiSelectFilters?.duration[1]
                            ? multiSelectFilters?.duration[1]
                            : DEFAULT_END_DATE,
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
                        acc[name] || (disease ? { disease, total: 0 } : { hazard, total: 0 });
                    existingEntry.total += total;
                    // @ts-ignore
                    acc[name] = existingEntry;
                    return acc;
                }, {} as Record<string, { disease: string; total: number } | { hazard: string; total: number }>)
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

        const fetchCasesAnalytics = (): FutureData<AnalyticsResponse> =>
            apiToFuture(
                this.api.analytics.get({
                    dimension: [
                        `dx:${NB_OF_CASES.map(({ id }) => id).join(";")}`,
                        "pe:LAST_30_DAYS",
                    ],
                    includeMetadataDetails: true,
                })
            );

        const fetchDeathsAnalytics = (): FutureData<AnalyticsResponse> =>
            apiToFuture(
                this.api.analytics.get({
                    dimension: [
                        `dx:${NB_OF_DEATHS.map(({ id }) => id).join(";")}`,
                        "pe:LAST_30_DAYS",
                    ],
                    includeMetadataDetails: true,
                })
            );

        return Future.joinObj({
            indicatorsProgramFuture: fetchEnrollmentsQuery(),
            nbOfCasesByDiseaseFuture: fetchCasesAnalytics(),
            nbOfDeathsByDiseaseFuture: fetchDeathsAnalytics(),
        }).map(
            ({
                indicatorsProgramFuture,
                nbOfCasesByDiseaseFuture,
                nbOfDeathsByDiseaseFuture,
            }: Record<string, AnalyticsResponse>) => {
                const cases = this.calculateTotals(nbOfCasesByDiseaseFuture, NB_OF_CASES);
                const deaths = this.calculateTotals(nbOfDeathsByDiseaseFuture, NB_OF_DEATHS);
                const mappedIndicators =
                    indicatorsProgramFuture?.rows.map((row: string[]) =>
                        this.mapRowToBaseIndicator(
                            row,
                            indicatorsProgramFuture.headers,
                            indicatorsProgramFuture.metaData
                        )
                    ) || [];

                return diseaseOutbreakEvents
                    .map(event => {
                        const baseIndicator = mappedIndicators.find(
                            indicator => indicator.id === event.id
                        );

                        if (!baseIndicator) return undefined;

                        return this.addCasesAndDeathsToIndicators(
                            event,
                            baseIndicator,
                            cases,
                            deaths
                        );
                    })
                    .filter(Boolean);
            }
        );
    }

    private calculateTotals(
        response: Maybe<AnalyticsResponse>,
        indicators: typeof NB_OF_CASES | typeof NB_OF_DEATHS
    ): Record<string, number> {
        return (
            response?.rows.reduce((acc: Record<string, number>, [key, , value]: string[]) => {
                const name = indicators.find(({ id }) => id === key)?.disease;
                if (name && value) {
                    acc[name] = (acc[name] || 0) + parseFloat(value);
                }
                return acc;
            }, {}) || {}
        );
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
                console.log(metaData.items);
                console.log(row[index]);
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

    private addCasesAndDeathsToIndicators(
        event: DiseaseOutbreakEventBaseAttrs,
        baseIndicator: Partial<ProgramIndicatorBaseAttrs>,
        cases: Record<string, number>,
        deaths: Record<string, number>
    ): ProgramIndicatorBaseAttrs {
        const { suspectedDisease, hazardType } = baseIndicator;
        const diseaseOrHazard = suspectedDisease || hazardType;
        return {
            ...baseIndicator,
            manager: event.incidentManagerName,
            cases: diseaseOrHazard ? cases[diseaseOrHazard]?.toString() || "" : "",
            deaths: diseaseOrHazard ? deaths[diseaseOrHazard]?.toString() || "" : "",
        } as ProgramIndicatorBaseAttrs;
    }
}
