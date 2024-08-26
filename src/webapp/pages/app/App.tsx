import React, { useEffect, useState } from "react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { Feedback } from "@eyeseetea/feedback-component";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
//@ts-ignore
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { appConfig } from "../../../app-config";
import { AppContext, AppContextState } from "../../contexts/app-context";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";
import { Router } from "../Router";
import Share from "../../components/share/Share";
import { HeaderBar } from "../../components/layout/header-bar/HeaderBar";
import "./App.css";
import { useDataEngine } from "@dhis2/app-runtime";
import { D2Api } from "@eyeseetea/d2-api/2.36";
import { getWebappCompositionRoot } from "../../../CompositionRoot";

export interface AppProps {
    api: D2Api;
}

function App(props: AppProps) {
    const { api } = props;
    const [showShareButton, setShowShareButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appContext, setAppContext] = useState<AppContextState | null>(null);
    const dataEngine = useDataEngine();

    useEffect(() => {
        async function setup() {
            const webappCompositionRoot = getWebappCompositionRoot(api, dataEngine);

            const isShareButtonVisible = appConfig.appearance.showShareButton;
            const currentUser = await webappCompositionRoot.users.getCurrent.execute().toPromise();
            if (!currentUser) throw new Error("User not logged in");

            setAppContext({ currentUser, compositionRoot: webappCompositionRoot });
            setShowShareButton(isShareButtonVisible);
            setLoading(false);
        }
        setup();
    }, [api, dataEngine]);

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
                                <Router />
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
