import { useCallback, useMemo, useState } from "react";
import _ from "../../../../domain/entities/generic/Collection";
import { useAppContext } from "../../../contexts/app-context";
import {
    FiltersValuesType,
    FiltersConfig,
    StatisticTableProps,
    TableColumn,
} from "./StatisticTable";
import { AlertDataSource } from "../../../../domain/entities/alert/Alert";

export const useTableFilters = (
    rows: StatisticTableProps["rows"],
    filtersConfig: FiltersConfig[]
) => {
    const { configurations } = useAppContext();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [eventSourceSelected, setEventSourceSelected] = useState<string>("");

    const [filters, setFilters] = useState<FiltersValuesType>(
        filtersConfig.reduce((acc: FiltersValuesType, filter) => {
            acc[filter.value] = [];
            return acc;
        }, {})
    );

    const allFiltersEmpty = useMemo(
        () => Object.keys(filters).every(key => (filters[key] || []).length === 0),
        [filters]
    );

    const filteredRows = useMemo(() => {
        if (searchTerm === "" && allFiltersEmpty && eventSourceSelected === "") {
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

                    const matchesEventSource =
                        eventSourceSelected === "" || row.eventSource === eventSourceSelected;

                    return matchesFilters && matchesSearchTerm && matchesEventSource;
                })
                .value();
        }
    }, [allFiltersEmpty, filters, searchTerm, eventSourceSelected, rows, filtersConfig]);

    const eventSourceOptions = useMemo(() => {
        const eventSources = configurations.selectableOptions.alertOptions.alertDataSources.map(
            dataSource => ({
                value: dataSource.id,
                label: dataSource.name,
            })
        );

        if (!eventSourceSelected && !allFiltersEmpty) {
            return _(filteredRows)
                .map(row => ({
                    value: row.eventSource || "",
                    label:
                        eventSources.find(eventSource => eventSource.value === row.eventSource)
                            ?.label ?? "",
                }))
                .uniqBy(row => row.value)
                .value();
        }

        return eventSources;
    }, [
        allFiltersEmpty,
        configurations.selectableOptions.alertOptions.alertDataSources,
        eventSourceSelected,
        filteredRows,
    ]);

    const filterOptions = useCallback(
        (column: TableColumn["value"], dataSource?: AlertDataSource) => {
            return _(rows)
                .compactMap(row => {
                    const columnValue = row[column] || "";
                    const filterOption = {
                        value: columnValue,
                        label: columnValue,
                    };

                    if (dataSource)
                        return row.eventSource === dataSource ? filterOption : undefined;
                    return filterOption;
                })
                .uniqBy(filter => filter.value)
                .value();
        },
        [rows]
    );

    return {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        filteredRows,
        filterOptions,
        eventSourceOptions,
        eventSourceSelected,
        setEventSourceSelected,
    };
};
