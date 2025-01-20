import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

import _ from "../../../domain/entities/generic/Collection";
import { Maybe } from "../../../utils/ts-utils";
import {
    FiltersConfig,
    FiltersValuesType,
} from "../../components/table/statistic-table/StatisticTable";
import { useTableFilters } from "../../components/table/statistic-table/useTableFilters";
import { Row } from "../../components/form/FormFieldsState";

export type Order<T> = { name: keyof T; direction: "asc" | "desc" };

type State<T> = {
    filteredData: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    order: Maybe<Order<T>>;
    onOrderBy: (columnValue: string) => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filters: FiltersValuesType;
    setFilters: Dispatch<SetStateAction<FiltersValuesType>>;
    filterOptions: (column: string) => { value: string; label: string }[];
    paginatedData: T[];
    totalPages: number;
    currentPage: number;
    goToPage: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const PAGE_SIZE = 20;

export function usePerformanceOverviewTable<T>(
    filtersConfig: FiltersConfig[],
    isPaginated?: boolean
): State<T> {
    const [data, setData] = useState<T[]>([]);
    const [filteredData, setFilteredData] = useState<T[]>([]);
    const [order, setOrder] = useState<Order<T>>();
    const [currentPage, setCurrentPage] = useState(1);

    const { searchTerm, setSearchTerm, filters, setFilters, filteredRows, filterOptions } =
        useTableFilters(data as Row[], filtersConfig);

    useEffect(() => {
        setFilteredData(filteredRows as T[]);
    }, [filteredRows]);

    const onOrderBy = useCallback((columnValue: string) => {
        setOrder(prevOrder => ({
            name: columnValue as keyof T,
            direction:
                prevOrder?.name === columnValue && prevOrder.direction === "asc" ? "desc" : "asc",
        }));
    }, []);

    useEffect(() => {
        if (filteredData.length && order) {
            setData(prevData => {
                const sortedData = _(prevData)
                    .orderBy([
                        [
                            item =>
                                Number.isNaN(Number(item[order.name]))
                                    ? item[order.name]
                                    : Number(item[order.name]),
                            order.direction,
                        ],
                    ])
                    .toArray();
                return sortedData;
            });
        }
    }, [filteredData.length, order]);

    const paginatedData = useMemo(() => {
        if (isPaginated) {
            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            return filteredData.slice(startIndex, endIndex);
        } else {
            return filteredData;
        }
    }, [currentPage, filteredData, isPaginated]);

    const totalPages = useMemo(() => Math.ceil(filteredData.length / PAGE_SIZE), [filteredData]);

    const goToPage = (_event: React.ChangeEvent<unknown>, page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        filteredData,
        setData,
        order,
        onOrderBy,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        filterOptions,
        paginatedData,
        totalPages,
        currentPage,
        goToPage,
    };
}
