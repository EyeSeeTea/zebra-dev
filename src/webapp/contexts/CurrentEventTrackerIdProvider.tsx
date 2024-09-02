import { PropsWithChildren, useState } from "react";
import { Id } from "../../domain/entities/Ref";
import { CurrentEventTrackerContext } from "./current-event-tracker-context";

export const CurrentEventTrackerContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currentEventTrackerId, setCurrentEventTrackerId] = useState<Id>();

    //PPS Module functions.
    const changeCurrentEventTrackerId = (id: Id) => {
        setCurrentEventTrackerId(id);
    };
    const resetCurrentEventTrackerId = () => {
        setCurrentEventTrackerId(undefined);
    };

    return (
        <CurrentEventTrackerContext.Provider
            value={{
                currentEventTrackerId,
                changeCurrentEventTrackerId,
                resetCurrentEventTrackerId,
            }}
        >
            {children}
        </CurrentEventTrackerContext.Provider>
    );
};
