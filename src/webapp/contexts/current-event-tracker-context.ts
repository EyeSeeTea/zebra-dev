import { createContext, useContext } from "react";
import { Maybe } from "../../utils/ts-utils";
import { Id } from "../../domain/entities/Ref";

export interface CurrentEventTrackerContextProps {
    currentEventTrackerId: Maybe<Id>;
    changeCurrentEventTrackerId: (id: string) => void;
    resetCurrentEventTrackerId: () => void;
}

export const CurrentEventTrackerContext = createContext<CurrentEventTrackerContextProps>({
    currentEventTrackerId: undefined,
    changeCurrentEventTrackerId: () => {},
    resetCurrentEventTrackerId: () => {},
});

export function useCurrentEventTrackerId() {
    const context = useContext(CurrentEventTrackerContext);
    if (context) {
        return context;
    } else {
        throw new Error("Current Event tracker Id context uninitialized");
    }
}
