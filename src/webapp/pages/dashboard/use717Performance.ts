import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { StatsCardProps } from "../../components/stats-card/StatsCard";
import {
    isDiseaseName,
    PerformanceMetrics717,
    PerformanceMetrics717Key,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../../../domain/entities/Ref";

type CardColors = StatsCardProps["color"];

const DAYS_DETECTION = "Days to detection";
const DAYS_NOTIFICATION = "Days to notification";
const DAYS_RESPONSE = "Days to early response";

export type PerformanceMetric717 = {
    title: string;
    primaryValue: number | "Inc";
    secondaryValue: number | "Inc";
    color: CardColors;
    totalValue?: number;
};
export type PerformanceMetric717State = {
    performanceMetrics717: PerformanceMetric717[];
    isLoading: boolean;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function use717Performance(options: {
    type: PerformanceMetrics717Key;
    diseaseOutbreakEventId?: Id;
    singleSelectFilters?: Record<string, string>;
}): PerformanceMetric717State {
    const { compositionRoot } = useAppContext();
    const { type, diseaseOutbreakEventId, singleSelectFilters } = options;

    const [performanceMetrics717, setPerformanceMetrics717] = useState<PerformanceMetric717[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getColor = useCallback(
        (key: string, value: number | "Inc", type: PerformanceMetrics717Key): CardColors => {
            if (type === "national" || type === "alerts") {
                switch (key) {
                    case "allTargets":
                        return "grey";
                    default:
                        if (value === "Inc") {
                            return "red";
                        } else if (value >= 50) {
                            return "green";
                        } else if (value > 0) {
                            return "red";
                        } else {
                            return "normal";
                        }
                }
            } else {
                switch (key) {
                    case DAYS_DETECTION:
                        return value === "Inc" ? "red" : value <= 7 ? "green" : "red";
                    case DAYS_NOTIFICATION:
                        return value === "Inc" ? "red" : value <= 1 ? "green" : "red";
                    case DAYS_RESPONSE:
                        return value === "Inc" ? "red" : value <= 7 ? "green" : "red";
                }
            }
        },
        []
    );

    const transformData = useCallback(
        (performanceMetrics: PerformanceMetrics717[]) => {
            const groupedPerformanceMetrics = _(performanceMetrics)
                .groupBy(performanceMetric => performanceMetric.name)
                .mapValues(([keyframes, values]) => {
                    const primaryValue = values.find(item => item.type === "primary")?.value ?? 0;
                    const secondaryValue =
                        values.find(item => item.type === "secondary")?.value ?? 0;

                    const title = keyframes
                        .replace(/([A-Z])/g, match => ` ${match}`)
                        .replace(/^./, match => match.toUpperCase())
                        .trim();

                    return {
                        title: title,
                        primaryValue: primaryValue,
                        secondaryValue: secondaryValue,
                        color: getColor(keyframes, primaryValue, type),
                        totalValue: _(values).first()?.total,
                    };
                })
                .values();

            return _(groupedPerformanceMetrics)
                .sortBy(metric => {
                    const order = ["Detection", "Notification", "Response", "All Targets"]; // preferred order of cards
                    return order.indexOf(metric.title);
                })
                .value();
        },
        [getColor, type]
    );

    const diseaseName = useMemo(() => {
        return isDiseaseName(singleSelectFilters?.disease)
            ? singleSelectFilters.disease
            : undefined;
    }, [singleSelectFilters?.disease]);

    useEffect(() => {
        setIsLoading(true);

        compositionRoot.performanceOverview.get717Performance
            .execute(type, diseaseOutbreakEventId, diseaseName)
            .run(
                performanceMetrics717 => {
                    setPerformanceMetrics717(transformData(performanceMetrics717));
                    setIsLoading(false);
                },
                error => {
                    console.error({ error });
                    setIsLoading(false);
                }
            );
    }, [
        compositionRoot.performanceOverview.get717Performance,
        diseaseName,
        diseaseOutbreakEventId,
        singleSelectFilters,
        transformData,
        type,
    ]);

    return {
        performanceMetrics717,
        isLoading,
    };
}
