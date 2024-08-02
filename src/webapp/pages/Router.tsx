import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import { DashboardPage } from "./dashboard/DashboardPage";
import { EventTrackerPage } from "./event-tracker/EventTrackerPage";
import { IncidentActionPlanPage } from "./incident-action-plan/IncidentActionPlanPage";
import { ResourcesPage } from "./resources/ResourcesPage";
import { IMTeamBuilderPage } from "./incident-management-team-builder/IMTeamBuilderPage";
import { FormPage } from "./form-page/FormPage";
import { RouteName, routes } from "../hooks/useRoutes";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route path={routes[RouteName.CREATE_FORM]} render={() => <FormPage />} />
                <Route path={routes[RouteName.EDIT_FORM]} render={() => <FormPage />} />
                <Route path={routes[RouteName.EVENT_TRACKER]} render={() => <EventTrackerPage />} />
                <Route
                    path={routes[RouteName.IM_TEAM_BUILDER]}
                    render={() => <IMTeamBuilderPage />}
                />
                <Route
                    path={routes[RouteName.INCIDENT_ACTION_PLAN]}
                    render={() => <IncidentActionPlanPage />}
                />
                <Route path={routes[RouteName.RESOURCES]} render={() => <ResourcesPage />} />
                {/* Default route */}
                <Route render={() => <DashboardPage />} />
            </Switch>
        </HashRouter>
    );
}
