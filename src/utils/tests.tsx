import { render, RenderResult } from "@testing-library/react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { AppContext, AppContextState } from "../webapp/contexts/app-context";
import { getTestCompositionRoot } from "../CompositionRoot";
import { createAdminUser } from "../domain/entities/__tests__/userFixtures";
import { MuiThemeProvider } from "@material-ui/core";
import { ThemeProvider } from "styled-components";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import muiThemeLegacy from "../webapp/pages/app/themes/dhis2-legacy.theme";
import { muiTheme } from "../webapp/pages/app/themes/dhis2.theme";
import { D2Api } from "../types/d2-api";

export function getTestContext() {
    const context: AppContextState = {
        currentUser: createAdminUser(),
        compositionRoot: getTestCompositionRoot(),
        api: {} as D2Api,
        isDev: true,
        configurations: {
            incidentManagerUserGroup: { id: "incidentManagerUserGroup" },
            selectableOptions: {
                eventTrackerConfigurations: {
                    dataSources: [],
                    mainSyndromes: [],
                    suspectedDiseases: [],
                    notificationSources: [],
                    incidentManagers: [],
                    casesDataSource: [],
                },
                alertOptions: {
                    alertDataSources: [],
                },
                riskAssessmentGradingConfigurations: {
                    populationAtRisk: [],
                    geographicalSpread: [],
                    capability: [],
                    capacity: [],
                    lowMediumHigh: [],
                },
                riskAssessmentSummaryConfigurations: {
                    overAllConfidencGlobal: [],
                    overAllConfidencNational: [],
                    overAllConfidencRegional: [],
                    overallRiskGlobal: [],
                    overallRiskNational: [],
                    overallRiskRegional: [],
                    riskAssessors: [],
                },
                riskAssessmentQuestionnaireConfigurations: {
                    consequences: [],
                    likelihood: [],
                    risk: [],
                },
                incidentActionPlanConfigurations: {
                    iapType: [],
                    phoecLevel: [],
                },
                incidentResponseActionConfigurations: {
                    searchAssignRO: [],
                    status: [],
                    verification: [],
                },
            },
            teamMembers: {
                all: [],
                riskAssessors: [],
                incidentManagers: [],
                responseOfficers: [],
            },
            orgUnits: [],
        },
    };

    return context;
}

export function getReactComponent(children: ReactNode): RenderResult {
    const context = getTestContext();

    return render(
        <MuiThemeProvider theme={muiTheme}>
            <ThemeProvider theme={muiTheme}>
                <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                    <MemoryRouter>
                        <AppContext.Provider value={context}>
                            <SnackbarProvider>{children}</SnackbarProvider>
                        </AppContext.Provider>
                    </MemoryRouter>
                </OldMuiThemeProvider>
            </ThemeProvider>
        </MuiThemeProvider>
    );
}
