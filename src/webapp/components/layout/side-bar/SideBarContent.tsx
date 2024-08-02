import { List, ListItem, ListItemText } from "@material-ui/core";
import React, { useCallback } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { AddCircleOutline } from "@material-ui/icons";

import i18n from "../../../../utils/i18n";
import { Button } from "../../button/Button";
import { RouteName, routes, useRoutes } from "../../../hooks/useRoutes";

type SideBarContentProps = {
    children?: React.ReactNode;
    hideOptions?: boolean;
    showCreateEvent?: boolean;
};

export type SideBarOption = {
    text: string;
    value: RouteName;
};

const DEFAULT_SIDEBAR_OPTIONS: SideBarOption[] = [
    {
        text: "Dashboard",
        value: RouteName.DASHBOARD,
    },
    {
        text: "Event Tracker",
        value: RouteName.EVENT_TRACKER,
    },
    {
        text: "IM Team Builder",
        value: RouteName.IM_TEAM_BUILDER,
    },
    {
        text: "Incident Action Plan",
        value: RouteName.INCIDENT_ACTION_PLAN,
    },
    {
        text: "Resources",
        value: RouteName.RESOURCES,
    },
];

export const SideBarContent: React.FC<SideBarContentProps> = React.memo(
    ({ children, hideOptions = false, showCreateEvent = false }) => {
        const { goTo } = useRoutes();

        const goToCreateEvent = useCallback(() => {
            goTo(RouteName.CREATE_FORM, { formType: "disease-outbreak-event" });
        }, [goTo]);

        return (
            <SideBarContainer hideOptions={hideOptions}>
                {hideOptions ? null : children ? (
                    children
                ) : showCreateEvent ? (
                    <CreateEventContainer>
                        <Button onClick={goToCreateEvent} startIcon={<AddCircleOutline />}>
                            {i18n.t("Create Event")}
                        </Button>
                    </CreateEventContainer>
                ) : (
                    <StyledList>
                        {DEFAULT_SIDEBAR_OPTIONS.map(({ text, value }) => (
                            <ListItem button key={text} component={NavLink} to={routes[value]}>
                                <StyledText primary={i18n.t(text)} selected={false} />
                            </ListItem>
                        ))}
                    </StyledList>
                )}
            </SideBarContainer>
        );
    }
);

const StyledText = styled(ListItemText)<{ selected?: boolean }>`
    .MuiTypography-root {
        color: ${props => props.theme.palette.sidebar.text};
        font-weight: ${props => (props.selected ? 700 : 400)};
        font-size: 0.875rem;
        padding-inline-start: 8px;
    }
`;

const SideBarContainer = styled.div<{ hideOptions?: boolean }>`
    display: flex;
    max-width: 245px;
    width: ${props => (props.hideOptions ? "338px" : "initial")};
    background-color: ${props => props.theme.palette.sidebar.background};
    .MuiList-root {
        padding-block: 50px;
    }
    .MuiButtonBase-root {
        padding-inline: 24px;
        padding-block: 4px;
    }
`;

const StyledList = styled(List)`
    width: 245px;
`;

const CreateEventContainer = styled.div`
    margin-block-start: 50px;
    margin-inline-start: 30px;
    width: 245px;
`;
