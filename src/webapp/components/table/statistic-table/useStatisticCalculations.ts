import { useCallback } from "react";
import { StatisticTableProps } from "./StatisticTable";

export const useStatisticCalculations = (
    rows: StatisticTableProps["rows"],
    columnRules: { [key: string]: number }
) => {
    const getFilteredRowsByColumn = useCallback(
        (column: string) => rows.filter(row => row[column] !== ""),
        [rows]
    );

    const calculateMedian = useCallback(
        (column: string) => {
            const values = getFilteredRowsByColumn(column).map(row => Number(row[column]));
            values.sort((a, b) => a - b);
            const mid = Math.floor(values.length / 2);
            return (
                (values.length % 2 !== 0
                    ? values[mid]
                    : ((values[mid - 1] || 0) + (values[mid] || 0)) / 2) || 0
            );
        },
        [getFilteredRowsByColumn]
    );

    const calculatePercentTargetMet = useCallback(
        (column: string) => {
            const filteredRows = getFilteredRowsByColumn(column);
            const target = columnRules[column] || 7;
            const count = filteredRows.filter(row => Number(row[column]) <= target).length;

            const percentage = (count / filteredRows.length) * 100 || 0;
            return `${percentage.toFixed(0) || 0}%`;
        },
        [getFilteredRowsByColumn, columnRules]
    );

    return {
        calculateMedian,
        calculatePercentTargetMet,
    };
};
