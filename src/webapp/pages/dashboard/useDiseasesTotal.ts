import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { EventTrackerCounts } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

export type Order = { name: string; direction: "asc" | "desc" };

export function useEventTrackerCounts(filters: Record<string, string[]>) {
    const { compositionRoot } = useAppContext();
    const [eventTrackerCounts, setEventTrackerCounts] = useState<EventTrackerCounts[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.performanceOverview.getEventTrackerCounts.execute(filters).run(
            diseasesTotal => {
                setEventTrackerCounts(diseasesTotal);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.performanceOverview.getEventTrackerCounts, filters]);

    return {
        eventTrackerCounts,
        isLoading,
    };
}
