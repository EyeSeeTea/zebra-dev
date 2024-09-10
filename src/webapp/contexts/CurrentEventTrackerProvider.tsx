import { PropsWithChildren, useState } from "react";
import { CurrentEventTrackerContext, EventTrackerDetails } from "./current-event-tracker-context";
import { DiseaseOutbreakEvent } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export const CurrentEventTrackerContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currentEventTracker, setCurrentEventTracker] = useState<DiseaseOutbreakEvent>();

    //PPS Module functions.
    const changeCurrentEventTracker = (EventTrackerDetails: DiseaseOutbreakEvent) => {
        setCurrentEventTracker(EventTrackerDetails);
    };
    const resetCurrentEventTracker = () => {
        setCurrentEventTracker(undefined);
    };

    return (
        <CurrentEventTrackerContext.Provider
            value={{
                currentEventTracker,
                changeCurrentEventTracker,
                resetCurrentEventTracker,
            }}
        >
            {children}
        </CurrentEventTrackerContext.Provider>
    );
};
