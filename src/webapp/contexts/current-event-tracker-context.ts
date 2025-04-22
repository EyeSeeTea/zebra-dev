import { createContext, useContext } from "react";
import { Maybe } from "../../utils/ts-utils";
import { DiseaseOutbreakEvent } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface CurrentEventTrackerContextProps {
    getCurrentEventTracker: () => Maybe<DiseaseOutbreakEvent>;
    changeCurrentEventTracker: (eventTrackerDetails: DiseaseOutbreakEvent) => void;
    resetCurrentEventTracker: () => void;
}

export const CurrentEventTrackerContext = createContext<CurrentEventTrackerContextProps>({
    getCurrentEventTracker: () => undefined,
    changeCurrentEventTracker: () => {},
    resetCurrentEventTracker: () => {},
});

export function useCurrentEventTracker() {
    const context = useContext(CurrentEventTrackerContext);
    if (context) {
        return context;
    } else {
        throw new Error("Current Event Tracker context uninitialized");
    }
}
