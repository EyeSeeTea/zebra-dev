import { useCallback, useMemo, useState } from "react";
import _ from "../../../../domain/entities/generic/Collection";
import {
    FiltersValuesType,
    FiltersConfig,
    StatisticTableProps,
    TableColumn,
} from "./StatisticTable";

export const useTableFilters = (
    rows: StatisticTableProps["rows"],
    filtersConfig: FiltersConfig[]
) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [filters, setFilters] = useState<FiltersValuesType>(
        filtersConfig.reduce((acc: FiltersValuesType, filter) => {
            acc[filter.value] = [];
            return acc;
        }, {})
    );

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
                        const isDatePickerFilter =
                            filtersConfig.find(filter => filter.value === key)?.type ===
                            "datepicker";

                        if (filterValues.length === 0) {
                            return true;
                        } else if (isDatePickerFilter) {
                            return row[key] && filterValues[0] && filterValues[1]
                                ? filterValues[0] <= (row[key] || "") &&
                                      (row[key] || "") <= filterValues[1]
                                : true;
                        } else {
                            return filterValues.includes(row[key] || "");
                        }
                    });

                    const matchesSearchTerm = _(Object.values(row)).some(cell =>
                        (cell || "").toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    return matchesFilters && matchesSearchTerm;
                })
                .value();
        }
    }, [filters, searchTerm, rows, filtersConfig]);

    const filterOptions = useCallback(
        (column: TableColumn["value"]) => {
            return _(rows)
                .map(row => ({
                    value: row[column] || "",
                    label: row[column] || "",
                }))
                .uniqBy(filter => filter.value)
                .value();
        },
        [rows]
    );

    return { searchTerm, setSearchTerm, filters, setFilters, filteredRows, filterOptions };
};
