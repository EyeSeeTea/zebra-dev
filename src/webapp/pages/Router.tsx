import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import { DashboardPage } from "./dashboard/DashboardPage";
import { EventTrackerPage } from "./event-tracker/EventTrackerPage";
import { IncidentActionPlanPage } from "./incident-action-plan/IncidentActionPlanPage";
import { ResourcesPage } from "./resources/ResourcesPage";
import { IMTeamBuilderPage } from "./incident-management-team-builder/IMTeamBuilderPage";
import { EditFormPage } from "./edit-form/EditFormPage";
import { CreateFormPage } from "./create-form/CreateFormPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/create/:formType" render={() => <CreateFormPage />} />
                <Route
                    path="/edit/:formType/:diseaseOutbreakEventId/:id?"
                    render={() => <EditFormPage />}
                />
                <Route
                    path="/event-tracker/:diseaseOutbreakEvent"
                    render={() => <EventTrackerPage />}
                />
                <Route
                    path="/incident-management-team-builder/:diseaseOutbreakEvent"
                    render={() => <IMTeamBuilderPage />}
                />
                <Route
                    path="/:diseaseOutbreakEvent/incident-action-plan/:incidentActionPlan"
                    render={() => <IncidentActionPlanPage />}
                />
                <Route path="/resources/:diseaseOutbreakEvent" render={() => <ResourcesPage />} />
                {/* Default route */}
                <Route render={() => <DashboardPage />} />
            </Switch>
        </HashRouter>
    );
}
