import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import { LandingPage } from "./landing/LandingPage";
import { DashboardPage } from "./dashboard/DashboardPage";
import { EventTrackerPage } from "./event-tracker/EventTrackerPage";
import { IncidentActionPlanPage } from "./incident-action-plan/IncidentActionPlanPage";
import { ResourcesPage } from "./resources/ResourcesPage";
import { IMTeamBuilderPage } from "./incident-management-team-builder/IMTeamBuilderPage";
import { CreateEventPage } from "./create-event/CreateEventPage";
import { CreateRiskAssessmentPage } from "./create-risk-assessment/CreateRiskAssessmentPage";
import { CreateIncidentActionPlanPage } from "./create-incident-action-plan/CreateIncidentActionPlanPage";
import { AssignRolePage } from "./assign-role/AssignRolePage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/dashboard" render={() => <DashboardPage />} />
                <Route path="/create-event" render={() => <CreateEventPage />} />
                <Route path="/edit-event/:event" render={() => <CreateEventPage />} />
                <Route path="/event-tracker" render={() => <EventTrackerPage />} />
                <Route path="/create-risk-assessment" render={() => <CreateRiskAssessmentPage />} />
                <Route
                    path="/incident-management-team-builder"
                    render={() => <IMTeamBuilderPage />}
                />
                <Route path="/assign-role" render={() => <AssignRolePage />} />
                <Route path="/edit-role/:role" render={() => <AssignRolePage />} />
                <Route path="/incident-action-plan" render={() => <IncidentActionPlanPage />} />
                <Route
                    path="/create-incident-action-plan"
                    render={() => <CreateIncidentActionPlanPage />}
                />
                <Route
                    path="/edit-incident-action-plan/:plan"
                    render={() => <CreateIncidentActionPlanPage />}
                />
                <Route
                    path="/edit-incident-action-plan/:response"
                    render={() => <CreateIncidentActionPlanPage />}
                />
                <Route path="/resources" render={() => <ResourcesPage />} />
                {/* Default route */}
                <Route render={() => <LandingPage />} />
            </Switch>
        </HashRouter>
    );
}
