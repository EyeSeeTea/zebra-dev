import React from "react";
import { join } from "string-ts";
import { generatePath as generatePathRRD, useHistory } from "react-router-dom";

import { FormType } from "../pages/form-page/FormPage";

export enum RouteName {
    CREATE_FORM = "CREATE_FORM",
    EDIT_FORM = "EDIT_FORM",
    EVENT_TRACKER = "EVENT_TRACKER",
    IM_TEAM_BUILDER = "IM_TEAM_BUILDER",
    INCIDENT_ACTION_PLAN = "INCIDENT_ACTION_PLAN",
    RESOURCES = "RESOURCES",
    DASHBOARD = "DASHBOARD",
}

const formTypes = [
    "disease-outbreak-event",
    "disease-outbreak-event-case-data",
    "risk-assessment-grading",
    "risk-assessment-summary",
    "risk-assessment-questionnaire",
    "incident-action-plan",
    "incident-response-actions",
    "incident-response-action",
    "incident-management-team-member-assignment",
] as const satisfies FormType[];

const formType = `:formType(${join(formTypes, "|")})` as const;

export const routes: Record<RouteName, string> = {
    [RouteName.CREATE_FORM]: `/create/${formType}`,
    [RouteName.EDIT_FORM]: `/edit/${formType}/:id`,
    [RouteName.EVENT_TRACKER]: "/event-tracker/:id",
    [RouteName.IM_TEAM_BUILDER]: "/:id/incident-management-team-builder",
    [RouteName.INCIDENT_ACTION_PLAN]: "/:id/incident-action-plan",
    [RouteName.RESOURCES]: "/resources",
    [RouteName.DASHBOARD]: "/",
} as const;

type RouteParams = {
    [RouteName.CREATE_FORM]: { formType: FormType };
    [RouteName.EDIT_FORM]: { formType: FormType; id: string };
    [RouteName.EVENT_TRACKER]: { id: string };
    [RouteName.IM_TEAM_BUILDER]: { id: string };
    [RouteName.INCIDENT_ACTION_PLAN]: { id: string };
    [RouteName.RESOURCES]: undefined;
    [RouteName.DASHBOARD]: undefined;
};

type State = {
    goTo: <T extends RouteName>(route: T, params?: RouteParams[T]) => void;
    generatePath: <T extends RouteName>(route: T, params?: RouteParams[T]) => string;
};

export function useRoutes(): State {
    const history = useHistory();

    const goTo = React.useCallback(
        <T extends RouteName>(route: T, params?: RouteParams[T]) => {
            const path = generatePathRRD(routes[route], params as any);
            history.push(path);
        },
        [history]
    );

    const generatePath = React.useCallback(
        <T extends RouteName>(route: T, params?: RouteParams[T]) => {
            const path = generatePathRRD(routes[route], params as any);
            return path;
        },
        []
    );

    return { goTo, generatePath };
}
