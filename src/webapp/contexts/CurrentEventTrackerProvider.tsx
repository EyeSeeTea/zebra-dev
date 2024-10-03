import { PropsWithChildren, useState } from "react";
import { CurrentEventTrackerContext } from "./current-event-tracker-context";
import { DiseaseOutbreakEvent } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Maybe } from "../../utils/ts-utils";

export const CurrentEventTrackerContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currentEventTracker, setCurrentEventTracker] = useState<DiseaseOutbreakEvent>();

    const changeCurrentEventTracker = (EventTrackerDetails: DiseaseOutbreakEvent) => {
        setCurrentEventTracker(EventTrackerDetails);
        localStorage.setItem("currentEventTracker", JSON.stringify(EventTrackerDetails));
    };
    const resetCurrentEventTracker = () => {
        setCurrentEventTracker(undefined);
        localStorage.removeItem("currentEventTracker");
    };

    const getCurrentEventTracker = (): Maybe<DiseaseOutbreakEvent> => {
        if (currentEventTracker) {
            return currentEventTracker;
        }
        const localCurrentEventTracker = localStorage.getItem("currentEventTracker");
        if (localCurrentEventTracker) {
            return JSON.parse(localCurrentEventTracker);
        }
        return undefined;
    };

    return (
        <CurrentEventTrackerContext.Provider
            value={{
                getCurrentEventTracker,
                changeCurrentEventTracker,
                resetCurrentEventTracker,
            }}
        >
            {children}
        </CurrentEventTrackerContext.Provider>
    );
};
