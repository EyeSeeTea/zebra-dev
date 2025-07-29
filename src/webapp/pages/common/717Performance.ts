import {
    PerformanceMetrics717,
    PerformanceMetrics717Key,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { StatsCardProps } from "../../components/stats-card/StatsCard";
import { PerformanceMetric717 } from "../dashboard/use717Performance";
import _ from "../../../domain/entities/generic/Collection";

export type CardColors = StatsCardProps["color"];

export const DAYS_DETECTION = "Days to detection";
export const DAYS_NOTIFICATION = "Days to notification";
export const DAYS_RESPONSE = "Days to early response";

export function getColor(
    key: string,
    value: number | "Inc",
    type: PerformanceMetrics717Key
): CardColors {
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
            case DAYS_RESPONSE:
                return value === "Inc" ? "red" : value <= 7 ? "green" : "red";
            case DAYS_NOTIFICATION:
                return value === "Inc" ? "red" : value <= 1 ? "green" : "red";
        }
    }
}

export function transformData(
    type: PerformanceMetrics717Key,
    performanceMetrics: PerformanceMetrics717[]
): PerformanceMetric717[] {
    const groupedPerformanceMetrics: PerformanceMetric717[] = _(performanceMetrics)
        .groupBy(performanceMetric => performanceMetric.name)
        .mapValues(([keyframes, values]) => {
            const primaryValue = values.find(item => item.type === "primary")?.value ?? 0;
            const secondaryValue = values.find(item => item.type === "secondary")?.value ?? 0;

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
}
