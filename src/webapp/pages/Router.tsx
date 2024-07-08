import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import { DashboardPage } from "./dashboard/DashboardPage";
import { EventTrackerPage } from "./event-tracker/EventTrackerPage";
import { IncidentActionPlanPage } from "./incident-action-plan/IncidentActionPlanPage";
import { ResourcesPage } from "./resources/ResourcesPage";
import { IMTeamBuilderPage } from "./incident-management-team-builder/IMTeamBuilderPage";
import { FormPage } from "./form/FormPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/create/:formType" render={() => <FormPage />} />
                <Route path="/edit/:formType/:id" render={() => <FormPage />} />
                <Route path="/event-tracker" render={() => <EventTrackerPage />} />
                <Route
                    path="/incident-management-team-builder"
                    render={() => <IMTeamBuilderPage />}
                />
                <Route
                    path="/incident-action-plan/:incidentActionPlanId"
                    render={() => <IncidentActionPlanPage />}
                />
                <Route path="/resources" render={() => <ResourcesPage />} />
                {/* Default route */}
                <Route render={() => <DashboardPage />} />
            </Switch>
        </HashRouter>
    );
}
