import { useCallback } from "react";
import { StatisticTableProps } from "./StatisticTable";

export const useStatisticCalculations = (
    rows: StatisticTableProps["rows"],
    columnRules: { [key: string]: number }
) => {
    const calculateMedian = useCallback(
        (column: string) => {
            const values = rows.map(row => Number(row[column])).filter(value => !isNaN(value));
            values.sort((a, b) => a - b);
            const mid = Math.floor(values.length / 2);
            return (
                (values.length % 2 !== 0
                    ? values[mid]
                    : ((values[mid - 1] || 0) + (values[mid] || 0)) / 2) || 0
            );
        },
        [rows]
    );

    const calculatePercentTargetMet = useCallback(
        (column: string) => {
            const target = columnRules[column] || 7;
            const count = rows.filter(row => Number(row[column]) <= target).length;
            const percentage = (count / rows.length) * 100 || 0;
            return `${percentage.toFixed(0) || 0}%`;
        },
        [rows, columnRules]
    );

    return {
        calculateMedian,
        calculatePercentTargetMet,
    };
};
