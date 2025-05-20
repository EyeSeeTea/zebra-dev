import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { OverviewCard } from "../../../domain/entities/PerformanceOverview";
import { useDataSourceFilter } from "./useDataSourceFilter";

export function useOverviewCards(isCasesDataUserDefined: boolean) {
    const { compositionRoot } = useAppContext();
    const [overviewCards, setOverviewCards] = useState<OverviewCard[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();
    const dataSourceFilter = useDataSourceFilter(isCasesDataUserDefined);

    useEffect(() => {
        const type = currentEventTracker?.suspectedDiseaseCode;
        const casesDataSource = currentEventTracker?.casesDataSource;

        if (type && casesDataSource) {
            setIsLoading(true);
            compositionRoot.performanceOverview.getOverviewCards
                .execute(type, dataSourceFilter.dataSource)
                .run(
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
    }, [
        compositionRoot.performanceOverview.getOverviewCards,
        currentEventTracker,
        dataSourceFilter.dataSource,
    ]);

    return {
        overviewCards,
        isLoading,
        dataSourceFilter,
    };
}
