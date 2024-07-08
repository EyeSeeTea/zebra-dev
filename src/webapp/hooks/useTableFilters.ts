import { useMemo } from "react";
import _ from "../../domain/entities/generic/Collection";
import {
    FiltersValuesType,
    StatisticTableProps,
} from "../components/table/statistic-table/StatisticTable";

export const useTableFilters = (
    rows: StatisticTableProps["rows"],
    searchTerm: string,
    filters: FiltersValuesType
) => {
    const filteredRows = useMemo(() => {
        const allFiltersEmpty = Object.keys(filters).every(
            key => (filters[key] || []).length === 0
        );

        if (searchTerm === "" && allFiltersEmpty) {
            return rows;
        } else {
            return _(rows)
                .filter(row => {
                    const matchesFilters = Object.keys(filters).every(key => {
                        const filterValues = filters[key] || [];
                        if (filterValues.length === 0) return true;
                        return filterValues.includes(row[key] || "");
                    });

                    const matchesSearchTerm = _(Object.values(row)).some(cell =>
                        (cell || "").toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    return matchesFilters && matchesSearchTerm;
                })
                .value();
        }
    }, [rows, searchTerm, filters]);

    return filteredRows;
};
