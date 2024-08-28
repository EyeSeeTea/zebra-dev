import { AnalyticsResponse, D2Api } from "../../types/d2-api";
import { AnalyticsRepository } from "../../domain/repositories/AnalyticsRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";
import { Future } from "../../domain/entities/generic/Future";

export type ProgramIndicatorBaseAttrs = {
    id: string;
    event: string;
    province: string;
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
    creationDate: Date;
};

enum IndicatorsId {
    suspectedDisease = "jLvbkuvPdZ6",
    event = "fyrLOW9Iwwv",
    era1 = "Ylmo2fEijff",
    era2 = "w4FOvRAyjEE",
    era3 = "RdLmpMM7lM5",
    era4 = "xT4TgUZhMkk",
    era5 = "UwEdN0kWFqv",
    era6 = "xtetmvZ9WoV",
    era7 = "GgUJMCklxFu",
    detect7d = "cGFwM7qiPzl",
    notify1d = "HDa3nE7Elxj",
    province = "ouname",
    manager = "createdbydisplayname",
    creationDate = "lastupdated",
    id = "tei",
}

const NB_OF_CASES = [
    {
        id: "fTDKNLsnjIV",
        disease: "AFP",
    },
    {
        id: "VkIaxVgudJ6",
        disease: "Acute VHF",
    },
    {
        id: "WhNO2qLViUr",
        disease: "Acute respiratory",
    },
    {
        id: "zRD7B2SCtTL",
        disease: "Anthrax",
    },
    {
        id: "xJCArVoiVv7",
        disease: "Bacterial meningitis",
    },
    {
        id: "BuSwWZ7LS0M",
        disease: "COVID19",
    },
    {
        id: "J44EMa8ARVJ",
        disease: "Cholera",
    },
    {
        id: "W1zvn77txyE",
        disease: "Diarrhoea with blood",
    },
    {
        id: "jYq8uL2Rly5",
        disease: "Measles",
    },
    {
        id: "oRmeFNBsNd1",
        disease: "Monkeypox",
    },
    {
        id: "UFbNrAk6CfZ",
        disease: "Neonatal tetanus",
    },
    {
        id: "WaQ1KeTe5jd",
        disease: "Plague",
    },
    {
        id: "f9scFbMvvDx",
        disease: "SARIs",
    },
    {
        id: "W8j7yMGG7qD",
        disease: "Typhoid fever",
    },
    {
        id: "yD6Rl5hHMg5",
        disease: "Zika fever",
    },
];

const NB_OF_DEATHS = [
    {
        id: "Uic7GHCJ2OS",
        disease: "AFP",
    },
    {
        id: "OVtL3yPhMPG",
        disease: "Acute VHF",
    },
    {
        id: "yMDKmk204qU",
        disease: "Acute respiratory",
    },
    {
        id: "folsJlzBpS9",
        disease: "Anthrax",
    },
    {
        id: "ACi2Kn3rrWd",
        disease: "Bacterial meningitis",
    },
    {
        id: "P4RZ0W8giNn",
        disease: "COVID19",
    },
    {
        id: "wPjA4MQGkbq",
        disease: "Cholera",
    },
    {
        id: "C3v4bxNQk5g",
        disease: "Diarrhoea with blood",
    },
    {
        id: "gcy8tqeKuIR",
        disease: "Measles",
    },
    {
        id: "DYsrZEDNFzy",
        disease: "Monkeypox",
    },
    {
        id: "hWU7I30NN6V",
        disease: "Neonatal tetanus",
    },
    {
        id: "knj5Ahdrwuc",
        disease: "Plague",
    },
    {
        id: "mklIyGZLCHT",
        disease: "SARIs",
    },
    {
        id: "UfXGJVsgn2B",
        disease: "Typhoid fever",
    },
    {
        id: "h70TBX2YxMB",
        disease: "Zika fever",
    },
];

// const DISEASE_OPTIONS = [
//     {
//         code: "3",
//         id: "CUXLvKISDY2",
//         name: "Acute respiratory",
//     },
//     {
//         code: "4",
//         id: "TCpS0UoNpG5",
//         name: "Acute VHF",
//     },
//     {
//         code: "2",
//         id: "PfHKoji1t6v",
//         name: "AFP",
//     },
//     {
//         code: "5",
//         id: "CtQI4qVXohj",
//         name: "Anthrax",
//     },
//     {
//         code: "6",
//         id: "D2YJm7Gq0l2",
//         name: "Bacterial meningitis ",
//     },
//     {
//         code: "7",
//         id: "VbeGvYy55fF",
//         name: "Cholera",
//     },
//     {
//         code: "1",
//         id: "y7e9Beqqekj",
//         name: "COVID19",
//     },
//     {
//         code: "8",
//         id: "tEyNuG0l0Dz",
//         name: "Diarrhoea with blood",
//     },
//     {
//         code: "9",
//         id: "XdZzApO9sLA",
//         name: "Measles",
//     },
//     {
//         code: "10",
//         id: "eGQRpZN36Ob",
//         name: "Monkeypox",
//     },
//     {
//         code: "11",
//         id: "SALXb1jRqhZ",
//         name: "Neonatal tetanus",
//     },
//     {
//         code: "12",
//         id: "D7wrmVb9Tnn",
//         name: "Plague",
//     },
//     {
//         code: "13",
//         id: "X5DuWwoTdrl",
//         name: "SARIs",
//     },
//     {
//         code: "14",
//         id: "hJxOq1DV37p",
//         name: "Typhoid fever",
//     },
//     {
//         code: "15",
//         id: "eR3zE3XVtwq",
//         name: "Zika fever",
//     },
// ];
export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api) {}

    getProgramIndicators(): FutureData<ProgramIndicatorBaseAttrs[]> {
        const indicatorsProgramFuture = apiToFuture(
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
                    ],
                }
                // this.api.analytics.getEnrollmentsQuery(RTSL_ZEBRA_PROGRAM_ID, {
                //     enrollmentDate: "LAST_12_MONTHS,THIS_MONTH",
                //     dimension: [
                //         `${IndicatorsId.suspectedDisease}:IN:2;4;3;5;6;1;7;8;9;10;11;12;13;14;15`,
                //         IndicatorsId.event,
                //         IndicatorsId.era1,
                //         IndicatorsId.era2,
                //         IndicatorsId.era3,
                //         IndicatorsId.era4,
                //         IndicatorsId.era5,
                //         IndicatorsId.era6,
                //         IndicatorsId.era7,
                //         IndicatorsId.detect7d,
                //         IndicatorsId.notify1d,
                //     ],
                // })
            )
        );

        const nbOfCasesByDiseaseFuture = apiToFuture<AnalyticsResponse>(
            this.api.analytics.get({
                dimension: [`dx:${NB_OF_CASES.map(({ id }) => id).join(";")}`, "pe:LAST_30_DAYS"],
                includeMetadataDetails: true,
            })
        );

        const nbOfDeathsByDiseaseFuture = apiToFuture<AnalyticsResponse>(
            this.api.analytics.get({
                dimension: [`dx:${NB_OF_DEATHS.map(({ id }) => id).join(";")}`, "pe:LAST_30_DAYS"],
                includeMetadataDetails: true,
            })
        );

        return Future.joinObj({
            indicatorsProgramFuture,
            nbOfCasesByDiseaseFuture,
            nbOfDeathsByDiseaseFuture,
        }).map(
            ({
                indicatorsProgramFuture: { rows, headers, metaData },
                nbOfCasesByDiseaseFuture,
                nbOfDeathsByDiseaseFuture,
            }: any) => {
                const cases = nbOfCasesByDiseaseFuture.rows.reduce(
                    (acc: Record<string, number>, [key, , value]: string[]) => {
                        const name = NB_OF_CASES.find(({ id }) => id === key)?.disease;
                        if (!name || !value) {
                            return acc;
                        }
                        if (!acc[name]) {
                            acc[name] = 0;
                        }
                        acc[name] += parseFloat(value);
                        return acc;
                    },
                    {} as Record<string, number>
                );

                const deaths = nbOfDeathsByDiseaseFuture.rows.reduce(
                    (acc: Record<string, number>, [key, , value]: string[]) => {
                        const name = NB_OF_DEATHS.find(({ id }) => id === key)?.disease;
                        if (!name || !value) {
                            return acc;
                        }
                        if (!acc[name]) {
                            acc[name] = 0;
                        }
                        acc[name] += parseFloat(value);
                        return acc;
                    },
                    {} as Record<string, number>
                );

                console.log({ cases, deaths });
                // console.log({ headers, metaData, rows });
                return rows.map((row: string[]) => {
                    return headers.reduce(
                        (
                            acc: Record<string, any>,
                            header: { name: string; column: string },
                            index: number
                        ) => {
                            const key = Object.keys(IndicatorsId).find(
                                key =>
                                    IndicatorsId[key as keyof typeof IndicatorsId] === header.name
                            );
                            if (!key) return acc;

                            if (key === "suspectedDisease") {
                                acc[key] = Object.values<
                                    Record<string, { code: string; name: string }>
                                >(metaData.items).find(item => item.code === row[index])?.name;
                                acc.cases = cases[acc.suspectedDisease];
                                acc.deaths = deaths[acc.suspectedDisease];
                            } else {
                                acc[key] = row[index];
                            }

                            return acc;
                        },
                        {}
                    );
                });
            }
        );
    }
}
