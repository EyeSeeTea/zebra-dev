import { useEffect, useState } from "react";
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

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.analytics.getDiseasesTotal.execute(filters).run(
            diseasesTotal => {
                console.log({ diseasesTotal });
                setDiseasesTotal(diseasesTotal);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.analytics.getDiseasesTotal, filters]);

    const filterOptions: FilterType[] = [
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
    ];

    return {
        diseasesTotal,
        filterOptions,
        isLoading,
        filters,
        setFilters,
    };
}
