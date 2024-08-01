import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import { DashboardPage } from "./dashboard/DashboardPage";
import { EventTrackerPage } from "./event-tracker/EventTrackerPage";
import { IncidentActionPlanPage } from "./incident-action-plan/IncidentActionPlanPage";
import { ResourcesPage } from "./resources/ResourcesPage";
import { IMTeamBuilderPage } from "./incident-management-team-builder/IMTeamBuilderPage";
import { FormPage } from "./form-page/FormPage";
import { RouteNames, routes } from "../hooks/useRoutes";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route path={routes[RouteNames.CREATE_FORM]} render={() => <FormPage />} />
                <Route path={routes[RouteNames.EDIT_FORM]} render={() => <FormPage />} />
                <Route
                    path={routes[RouteNames.EVENT_TRACKER]}
                    render={() => <EventTrackerPage />}
                />
                <Route
                    path={routes[RouteNames.IM_TEAM_BUILDER]}
                    render={() => <IMTeamBuilderPage />}
                />
                <Route
                    path={routes[RouteNames.INCIDENT_ACTION_PLAN]}
                    render={() => <IncidentActionPlanPage />}
                />
                <Route path={routes[RouteNames.RESOURCES]} render={() => <ResourcesPage />} />
                {/* Default route */}
                <Route render={() => <DashboardPage />} />
            </Switch>
        </HashRouter>
    );
}
