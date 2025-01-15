import React, { useContext } from "react";
import { CompositionRoot } from "../../CompositionRoot";
import { User } from "../../domain/entities/User";
import { D2Api } from "../../types/d2-api";
import { Configurations } from "../../domain/entities/AppConfigurations";

export interface AppContextState {
    api: D2Api;
    isDev: boolean;
    currentUser: User;
    compositionRoot: CompositionRoot;
    configurations: Configurations;
}

export const AppContext = React.createContext<AppContextState | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (context) {
        return context;
    } else {
        throw new Error("App context uninitialized");
    }
}
