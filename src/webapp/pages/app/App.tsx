import React, { useEffect, useState } from "react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { Feedback } from "@eyeseetea/feedback-component";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
//@ts-ignore
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { appConfig } from "../../../app-config";
import { CompositionRoot } from "../../../CompositionRoot";
import { AppContext, AppContextState } from "../../contexts/app-context";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";
import { Router } from "../Router";
import Share from "../../components/share/Share";
import { HeaderBar } from "../../components/layout/header-bar/HeaderBar";
import "./App.css";
import { CurrentEventTrackerContextProvider } from "../../contexts/CurrentEventTrackerProvider";

export interface AppProps {
    compositionRoot: CompositionRoot;
}

function App(props: AppProps) {
    const { compositionRoot } = props;
    const [showShareButton, setShowShareButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appContext, setAppContext] = useState<AppContextState | null>(null);

    useEffect(() => {
        async function setup() {
            const isShareButtonVisible = appConfig.appearance.showShareButton;
            const currentUser = await compositionRoot.users.getCurrent.execute().toPromise();
            if (!currentUser) throw new Error("User not logged in");

            setAppContext({ currentUser, compositionRoot });
            setShowShareButton(isShareButtonVisible);
            setLoading(false);
        }
        setup();
    }, [compositionRoot]);

    if (loading) return null;

    return (
        <MuiThemeProvider theme={muiTheme}>
            <ThemeProvider theme={muiTheme}>
                <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                    <SnackbarProvider>
                        <HeaderBar name="ZEBRA" />
                        {appConfig.feedback && appContext && (
                            <Feedback
                                options={appConfig.feedback}
                                username={appContext.currentUser.username}
                            />
                        )}

                        <div id="app" className="content">
                            <AppContext.Provider value={appContext}>
                                <CurrentEventTrackerContextProvider>
                                    <Router />
                                </CurrentEventTrackerContextProvider>
                            </AppContext.Provider>
                        </div>

                        <Share visible={showShareButton} />
                    </SnackbarProvider>
                </OldMuiThemeProvider>
            </ThemeProvider>
        </MuiThemeProvider>
    );
}

export default React.memo(App);
