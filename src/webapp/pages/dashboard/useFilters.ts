import { useCallback, useEffect, useState } from "react";
import { FiltersConfig } from "../../components/table/statistic-table/StatisticTable";
import { EvenTrackerCountsIndicatorMap } from "../../../data/repositories/consts/PerformanceOverviewConstants";
import _c from "../../../domain/entities/generic/Collection";

export function useFilters() {
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [filterOptions, setFilterOptions] = useState<FiltersConfig[]>([]);

    const buildFilterOptions = (): FiltersConfig[] => {
        const createOptions = (key: "disease" | "hazard") =>
            _c(EvenTrackerCountsIndicatorMap)
                .filter(value => value.type === key)
                .uniqBy(value => value.name)
                .map(value => ({
                    value: value.name,
                    label: value.name,
                }))

                .value();

        return [
            {
                value: "incidentStatus",
                label: "Incident Status",
                type: "multiselector",
                options: [
                    { value: "Respond", label: "Respond" },
                    { value: "Alert", label: "Alert" },
                    { value: "Watch", label: "Watch" },
                ],
            },
            {
                value: "disease",
                label: "Disease",
                type: "multiselector",
                options: createOptions("disease"),
            },
            {
                value: "hazard",
                label: "Hazard Type",
                type: "multiselector",
                options: createOptions("hazard"),
            },
        ];
    };

    const handleSetFilters = useCallback(
        (newFilters: Record<string, string[]>) => {
            setFilters(newFilters);
            setFilterOptions(
                filterOptions.map(option => ({
                    ...option,
                    disabled:
                        (newFilters.disease && newFilters.disease.length > 0
                            ? option.value === "hazard"
                            : false) ||
                        (newFilters.hazard && newFilters.hazard.length > 0
                            ? option.value === "disease"
                            : false),
                }))
            );
        },
        [filterOptions]
    );

    // Initialize filter options based on diseasesTotal
    useEffect(() => {
        setFilterOptions(buildFilterOptions());
    }, []);

    return { filters, filterOptions, setFilters: handleSetFilters };
}
