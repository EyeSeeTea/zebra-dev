import { PropsWithChildren, useCallback, useState } from "react";
import { DiseaseNames } from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { ExistingEventTrackerTypesContext } from "./existing-event-tracker-types-context";

export const ExistingEventTrackerTypesProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [existingEventTrackerTypes, setExistingEventTrackerTypes] = useState<DiseaseNames[]>([]);

    const changeExistingEventTrackerTypes = useCallback(
        (updatedExistingEventTrackerTypes: DiseaseNames[]) => {
            setExistingEventTrackerTypes(updatedExistingEventTrackerTypes);
        },
        []
    );

    return (
        <ExistingEventTrackerTypesContext.Provider
            value={{
                existingEventTrackerTypes,
                changeExistingEventTrackerTypes,
            }}
        >
            {children}
        </ExistingEventTrackerTypesContext.Provider>
    );
};
