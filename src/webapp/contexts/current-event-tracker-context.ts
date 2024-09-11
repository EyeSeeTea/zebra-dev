import { createContext, useContext } from "react";
import { Maybe } from "../../utils/ts-utils";
import { Id, NamedRef } from "../../domain/entities/Ref";
import {
    DataSource,
    DiseaseOutbreakEvent,
    HazardType,
} from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export interface EventTrackerDetails {
    id: Id;
    name: string;
    dataSource: DataSource;
    hazardType: Maybe<HazardType>;
    suspectedDisease: Maybe<NamedRef>;
    lastUpdated: string;
}

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
