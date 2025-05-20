import { createContext, useContext } from "react";
import { DiseaseNames } from "../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

export interface ExistingEventTrackerTypesProps {
    existingEventTrackerTypes: DiseaseNames[];
    changeExistingEventTrackerTypes: (existingEventTrackerTypes: DiseaseNames[]) => void;
}

export const ExistingEventTrackerTypesContext = createContext<ExistingEventTrackerTypesProps>({
    existingEventTrackerTypes: [],
    changeExistingEventTrackerTypes: () => {},
});

export function useExistingEventTrackerTypes() {
    const context = useContext(ExistingEventTrackerTypesContext);
    if (context) {
        return context;
    } else {
        throw new Error("Existing Event Tracker Types context uninitialized");
    }
}
