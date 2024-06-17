import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

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
                <Route path="/create-event" render={() => <CreateEventPage />} />
                <Route path="/event-tracker/:event" render={() => <EventTrackerPage />} />
                <Route
                    path="/create-risk-assessment/:event"
                    render={() => <CreateRiskAssessmentPage />}
                />
                <Route
                    path="/incident-management-team-builder/:event"
                    render={() => <IMTeamBuilderPage />}
                />
                <Route path="/assign-role/:event" render={() => <AssignRolePage />} />
                <Route
                    path="/incident-action-plan/:event"
                    render={() => <IncidentActionPlanPage />}
                />
                <Route
                    path="/create-incident-action-plan/:event"
                    render={() => <CreateIncidentActionPlanPage />}
                />
                <Route path="/resources/:event" render={() => <ResourcesPage />} />
                {/* Default route */}
                <Route render={() => <DashboardPage />} />
            </Switch>
        </HashRouter>
    );
}
