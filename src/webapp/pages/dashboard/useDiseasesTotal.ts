import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";

type State = {
    diseasesTotal: any[];
    isLoading: boolean;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function useDiseasesTotal(
    singleSelectFilters: Record<string, string>,
    multiSelectFilters: Record<string, string[]>
): State {
    const { compositionRoot } = useAppContext();

    const [diseasesTotal, setDiseasesTotal] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.analytics.getDiseasesTotal
            .execute(singleSelectFilters, multiSelectFilters)
            .run(
                diseasesTotal => {
                    setDiseasesTotal(diseasesTotal);
                    setIsLoading(false);
                },
                error => {
                    console.error({ error });
                    setIsLoading(false);
                }
            );
    }, [compositionRoot.analytics.getDiseasesTotal, multiSelectFilters, singleSelectFilters]);

    return {
        diseasesTotal,
        isLoading,
    };
}
