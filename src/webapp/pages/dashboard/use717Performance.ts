import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { StatsCardProps } from "../../components/stats-card/StatsCard";
import { PerformanceMetrics717 } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

type CardColors = StatsCardProps["color"];
export type PerformanceIndicator717 = {
    performanceIndicators: {
        title: string;
        percent: number;
        count: number;
        color: CardColors;
    }[];
    isLoading: boolean;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function use717Performance(): PerformanceIndicator717 {
    const { compositionRoot } = useAppContext();

    const [performanceIndicators, setPerformanceIndicators] = useState<
        PerformanceIndicator717["performanceIndicators"]
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    const getColor = useCallback((key: string, percent: number): CardColors => {
        if (key === "allTargets") {
            return "grey";
        } else if (percent >= 50) {
            return "green";
        } else if (percent > 0) {
            return "red";
        }
        return "normal";
    }, []);

    const transformData = useCallback(
        (performanceIndicators: PerformanceMetrics717[]) => {
            const performanceIndicatorsByName = _(performanceIndicators).reduce(
                (acc: Record<string, typeof performanceIndicators>, indicator) => {
                    const key = indicator.name;
                    const existingGroup = acc[key] || [];
                    acc[key] = [...existingGroup, indicator];
                    return acc;
                },
                {} as Record<string, typeof performanceIndicators>
            );
            return Object.entries(performanceIndicatorsByName).map(([key, values]) => {
                const percentObj = values.find(item => item.type === "percent");
                const countObj = values.find(item => item.type === "count");

                const percent = percentObj?.value ?? 0;
                const count = countObj?.value ?? 0;

                const title = key
                    .replace(/([A-Z])/g, match => ` ${match}`)
                    .replace(/^./, match => match.toUpperCase())
                    .trim();
                return {
                    title: title,
                    percent: percent,
                    count: count,
                    color: getColor(key, percent),
                };
            });
        },
        [getColor]
    );

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.get717Performance.execute().run(
            performanceIndicators => {
                setPerformanceIndicators(transformData(performanceIndicators));
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.performanceOverview.get717Performance, transformData]);

    return {
        performanceIndicators,
        isLoading,
    };
}
