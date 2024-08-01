import React from "react";
import { generatePath, useHistory } from "react-router-dom";
import { FormType } from "../pages/form-page/FormPage";

export enum RouteNames {
    CREATE_FORM = "CREATE_FORM",
    EDIT_FORM = "EDIT_FORM",
    EVENT_TRACKER = "EVENT_TRACKER",
    IM_TEAM_BUILDER = "IM_TEAM_BUILDER",
    INCIDENT_ACTION_PLAN = "INCIDENT_ACTION_PLAN",
    RESOURCES = "RESOURCES",
    DASHBOARD = "DASHBOARD",
}

export const routes: Record<RouteNames, string> = {
    [RouteNames.CREATE_FORM]: "/create/:formType",
    [RouteNames.EDIT_FORM]: "/edit/:formType/:id",
    [RouteNames.EVENT_TRACKER]: "/event-tracker",
    [RouteNames.IM_TEAM_BUILDER]: "/incident-management-team-builder",
    [RouteNames.INCIDENT_ACTION_PLAN]: "/incident-action-plan",
    [RouteNames.RESOURCES]: "/resources",
    [RouteNames.DASHBOARD]: "/",
};

type RouteParams = {
    [RouteNames.CREATE_FORM]: { formType: FormType };
    [RouteNames.EDIT_FORM]: { formType: FormType; id: string };
    [RouteNames.EVENT_TRACKER]: undefined;
    [RouteNames.IM_TEAM_BUILDER]: undefined;
    [RouteNames.INCIDENT_ACTION_PLAN]: undefined;
    [RouteNames.RESOURCES]: undefined;
    [RouteNames.DASHBOARD]: undefined;
};

export function useRoutes() {
    const history = useHistory();

    const goTo = React.useCallback(
        <T extends RouteNames>(route: T, params?: RouteParams[T]) => {
            const path = generatePath(routes[route], params as any);
            history.push(path);
        },
        [history]
    );

    return { goTo };
}
