import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { OverviewCard } from "../../../domain/entities/PerformanceOverview";

export function useOverviewCards() {
    const { compositionRoot } = useAppContext();
    const [overviewCards, setOverviewCards] = useState<OverviewCard[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();

    useEffect(() => {
        const type = currentEventTracker?.suspectedDiseaseCode || currentEventTracker?.hazardType;
        const casesDataSource = currentEventTracker?.casesDataSource;

        if (type && casesDataSource) {
            setIsLoading(true);
            compositionRoot.performanceOverview.getOverviewCards.execute(type, casesDataSource).run(
                overviewCards => {
                    setIsLoading(false);
                    setOverviewCards(overviewCards);
                },
                err => {
                    setIsLoading(false);
                    console.error(err);
                }
            );
        }
    }, [compositionRoot.performanceOverview.getOverviewCards, currentEventTracker]);

    return {
        overviewCards,
        isLoading,
    };
}
