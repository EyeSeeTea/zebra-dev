// @ts-nocheck
import { Maybe } from "../../utils/ts-utils";
import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { PerformanceOverviewRepository } from "../../domain/repositories/PerformanceOverviewRepository";
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
import { Id } from "../../domain/entities/Ref";
import { OrgUnit } from "../../domain/entities/OrgUnit";

type Disease =
    | "AFP"
    | "Acute VHF"
    | "Acute respiratory"
    | "Anthrax"
    | "Bacterial meningitis"
    | "COVID19"
    | "Cholera"
    | "Diarrhoea with blood"
    | "Measles"
    | "Monkeypox"
    | "Neonatal tetanus"
    | "Plague"
    | "SARIs"
    | "Typhoid fever"
    | "Zika fever";

type Hazard = "Animal type" | "Human type" | "Human and Animal type" | "Environmental type";

export type PerformanceOverviewMetrics = {
    id: Id;
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
    suspectedDisease: Disease;
    hazardType: Hazard;
};

interface DiseaseEntry {
    disease: Disease;
    total: number;
}

interface HazardEntry {
    hazard: Hazard;
    total: number;
}

export type DiseaseTotalAttrs = DiseaseEntry | HazardEntry;

export class PerformanceOverviewD2Repository implements PerformanceOverviewRepository {
    constructor(private api: D2Api) {}

    getDiseasesTotal(filters?: Record<string, string[]>): FutureData<DiseaseTotalAttrs[]> {
        const transformData = (data: string[][], activeVerified: typeof NB_OF_ACTIVE_VERIFIED) => {
            return data
                .flatMap(([id, _period, _orgUnit, total]) => {
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

        const fetchActiveVerifiedAnalytics = (): FutureData<AnalyticsResponse> =>
            apiToFuture(
                this.api.analytics.get({
                    dimension: [
                        `dx:${NB_OF_ACTIVE_VERIFIED.map(({ id }) => id).join(";")}`,
                        "ou:LEVEL-2",
                        "pe:THIS_YEAR",
                    ],
                    includeMetadataDetails: true,
                })
            );
        return fetchActiveVerifiedAnalytics().map(res => {
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
                            ? { disease: disease as Disease, total: 0 }
                            : { hazard: hazard as Hazard, total: 0 });

                    existingEntry.total += total;
                    acc[name] = existingEntry;
                    return acc;
                }, {} as Record<string, DiseaseEntry | HazardEntry>)
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
                            (indicator: Partial<PerformanceOverviewMetrics>) =>
                                indicator.id === event.id
                        );

                        if (!baseIndicator) return undefined;

                        return this.addCasesAndDeathsToIndicators(
                            event,
                            baseIndicator,
                            cases,
                            deaths
                        );
                    })
                    .filter((item): item is PerformanceOverviewMetrics => Boolean(item));
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
    ): Partial<PerformanceOverviewMetrics> {
        return headers.reduce((acc, header, index) => {
            const key = Object.keys(IndicatorsId).find(
                key => IndicatorsId[key as keyof typeof IndicatorsId] === header.name
            ) as Maybe<keyof PerformanceOverviewMetrics>;

            if (!key) return acc;

            if (key === "suspectedDisease") {
                const foundItem = Object.values<{
                    code: string;
                    name:
                        | PerformanceOverviewMetrics["suspectedDisease"]
                        | PerformanceOverviewMetrics["hazardType"];
                }>(metaData.items).find(item => item.code === row[index]);

                if (foundItem && this.isSuspectedDisease(foundItem.name)) {
                    acc[key] = foundItem.name;
                }
            } else {
                acc[key] = row[index] as (Hazard & OrgUnit[]) | undefined;
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

    private addCasesAndDeathsToIndicators(
        event: DiseaseOutbreakEventBaseAttrs,
        baseIndicator: Partial<PerformanceOverviewMetrics>,
        cases: Record<string, number>,
        deaths: Record<string, number>
    ): PerformanceOverviewMetrics {
        const { suspectedDisease, hazardType } = baseIndicator;
        const diseaseOrHazard = suspectedDisease || hazardType;

        return {
            ...baseIndicator,
            manager: event.incidentManagerName,
            duration: `${moment().diff(moment(event.emerged.date), "days").toString()}d`,
            cases: diseaseOrHazard ? cases[diseaseOrHazard]?.toString() || "" : "",
            deaths: diseaseOrHazard ? deaths[diseaseOrHazard]?.toString() || "" : "",
        } as PerformanceOverviewMetrics;
    }
}
