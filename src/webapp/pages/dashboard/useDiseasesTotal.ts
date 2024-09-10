import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { FilterType } from "../../components/table/statistic-table/StatisticTable";

type State = {
    diseasesTotal: any[];
    filters: Record<string, string[]>;
    setFilters: (filters: Record<string, string[]>) => void;
    filterOptions: FilterType[];
    isLoading: boolean;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function useDiseasesTotal(): State {
    const { compositionRoot } = useAppContext();

    const [diseasesTotal, setDiseasesTotal] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [filterOptions, setFilterOptions] = useState<FilterType[]>([]);

    const buildFilterOptions = (
        diseasesTotal: { disease?: string; hazard?: string }[]
    ): FilterType[] => {
        const createOptions = (key: "disease" | "hazard") =>
            diseasesTotal
                .map(item => item[key])
                .filter((value): value is string => !!value)
                .map(value => ({ value, label: value }));

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

    // Fetch diseasesTotal and config filters on initial load
    useEffect(() => {
        setIsLoading(true);
        compositionRoot.analytics.getDiseasesTotal.execute({}).run(
            diseasesTotal => {
                setDiseasesTotal(diseasesTotal);
                setFilterOptions(buildFilterOptions(diseasesTotal));
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.analytics.getDiseasesTotal]);

    // Fetch diseasesTotal when filters change
    useEffect(() => {
        if (Object.keys(filters).length === 0) return; // Skip fetching on initial load

        setIsLoading(true);
        compositionRoot.analytics.getDiseasesTotal.execute(filters).run(
            diseasesTotal => {
                setDiseasesTotal(diseasesTotal);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.analytics.getDiseasesTotal, filters]);

    const handleSetFilters = useCallback(
        (oldFilters: Record<string, string[]>) => {
            setFilters(oldFilters);
            setFilterOptions(
                filterOptions.map(option => ({
                    ...option,
                    disabled:
                        (oldFilters.disease && oldFilters.disease.length > 0
                            ? option.value === "hazard"
                            : false) ||
                        (oldFilters.hazard && oldFilters.hazard.length > 0
                            ? option.value === "disease"
                            : false),
                }))
            );
        },
        [filterOptions]
    );

    return {
        diseasesTotal,
        filterOptions,
        isLoading,
        filters,
        setFilters: handleSetFilters,
    };
}
