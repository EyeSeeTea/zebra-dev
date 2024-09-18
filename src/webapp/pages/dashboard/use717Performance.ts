import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { StatsCardProps } from "../../components/stats-card/StatsCard";
import { Indicator717PerformanceBaseAttrs } from "../../../data/repositories/AnalyticsD2Repository";

export type PerformanceIndicator717 = {
    performanceIndicators: {
        title: string;
        percent: number;
        count: number;
        color: StatsCardProps["color"];
    }[];
    isLoading: boolean;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function use717Performance(filters: Record<string, string[]>): PerformanceIndicator717 {
    const { compositionRoot } = useAppContext();

    const [performanceIndicators, setPerformanceIndicators] = useState<
        PerformanceIndicator717["performanceIndicators"]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const transformData = (performanceIndicators: Indicator717PerformanceBaseAttrs[]) => {
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

            const percent = percentObj ? percentObj.value : 0;
            const count = countObj ? countObj.value : 0;

            let color: "green" | "red" | "grey" | "normal" | undefined;
            if (key === "allTargets") {
                color = "grey";
            } else if (percent >= 50) {
                color = "green";
            } else if (percent > 0) {
                color = "red";
            }

            const title = key
                .replace(/([A-Z])/g, match => ` ${match}`)
                .replace(/^./, match => match.toUpperCase())
                .trim();
            return {
                title: title,
                percent: percent,
                count: count,
                color: color,
            };
        });
    };

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.analytics.get717Performance.execute(filters).run(
            performanceIndicators => {
                setPerformanceIndicators(transformData(performanceIndicators));
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.analytics.get717Performance, filters]);

    return {
        performanceIndicators,
        isLoading,
    };
}
