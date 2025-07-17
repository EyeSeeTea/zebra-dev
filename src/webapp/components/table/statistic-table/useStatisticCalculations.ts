import { useCallback } from "react";
import { Row } from "./StatisticTable";
import { calculateMedian as calculateMedianFunction } from "../../../pages/common/statisticCalculations";

export const useStatisticCalculations = (rows: Row[], columnRules: { [key: string]: number }) => {
    const getFilteredRowsByColumn = useCallback(
        (column: string) => rows.filter(row => row[column] !== ""),
        [rows]
    );

    const calculateMedian = useCallback(
        (column: string) => {
            const values = getFilteredRowsByColumn(column).map(row => Number(row[column]));
            return calculateMedianFunction(values);
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
