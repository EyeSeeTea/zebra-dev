import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { TotalCardCounts } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

export type Order = { name: string; direction: "asc" | "desc" };

export function useCardCounts(filters: Record<string, string[]>) {
    const { compositionRoot } = useAppContext();
    const [cardCounts, setCardCounts] = useState<TotalCardCounts[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.getEventTrackerCounts.execute(filters).run(
            diseasesTotal => {
                setCardCounts(diseasesTotal);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot, filters]);

    return {
        cardCounts,
        isLoading,
    };
}
