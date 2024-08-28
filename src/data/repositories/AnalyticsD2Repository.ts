import { D2Api, AnalyticsResponse } from "../../types/d2-api";
import { AnalyticsRepository } from "../../domain/repositories/AnalyticsRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import _ from "../../domain/entities/generic/Collection";

export type ProgramIndicatorBaseAttrs = {
    id: string;
    event: string;
    province: string;
    manager: string;
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

const SUSPECTED_DISEASE_ID = "jLvbkuvPdZ6";

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

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api) {}

    getProgramIndicators(): FutureData<ProgramIndicatorBaseAttrs[]> {
        return apiToFuture(
            this.api.get<AnalyticsResponse>(
                `/analytics/enrollments/query/${RTSL_ZEBRA_PROGRAM_ID}`,
                {
                    enrollmentDate: "LAST_12_MONTHS,THIS_MONTH",
                    dimension: [
                        `${SUSPECTED_DISEASE_ID}:IN:2;4;3;5;6;1;7;8;9;10;11;12;13;14;15,ou:USER_ORGUNIT,${[
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
                        ].join(",")}`,
                    ],
                    outputType: "ENROLLMENT",
                }
            )
        ).map(({ rows, headers, metaData }: any) => {
            // console.log({ headers, metaData, rows });
            return rows.map((row: string[]) => {
                return headers.reduce(
                    (
                        acc: Record<string, any>,
                        header: { name: string; column: string },
                        index: number
                    ) => {
                        const key = Object.keys(IndicatorsId).find(
                            key => IndicatorsId[key as keyof typeof IndicatorsId] === header.name
                        );
                        if (!key) return acc;

                        if (key === "suspectedDisease") {
                            acc[key] = Object.values<
                                Record<string, { code: string; name: string }>
                            >(metaData.items).find(item => item.code === row[index])?.name;
                        } else {
                            acc[key] = row[index];
                        }

                        return acc;
                    },
                    {}
                );
            });
        });
    }
}
