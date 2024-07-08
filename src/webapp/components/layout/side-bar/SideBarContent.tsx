import { List, ListItem, ListItemText } from "@material-ui/core";
import React, { useCallback } from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { AddCircleOutline } from "@material-ui/icons";

import i18n from "../../../../utils/i18n";
import { Button } from "../../button/Button";

type SideBarContentProps = {
    children?: React.ReactNode;
    hideOptions?: boolean;
    showCreateEvent?: boolean;
};

type SideBarOption = {
    text: string;
    value: string;
};

const DEFAULT_SIDEBAR_OPTIONS: SideBarOption[] = [
    {
        text: "Dashboard",
        value: "/dashboard",
    },
    {
        text: "Event Tracker",
        value: "/event-tracker",
    },
    {
        text: "IM Team Builder",
        value: "/incident-management-team-builder",
    },
    {
        text: "Incident Action Plan",
        value: "/incident-action-plan",
    },
    {
        text: "Resources",
        value: "/resources",
    },
];

export const SideBarContent: React.FC<SideBarContentProps> = React.memo(
    ({ children, hideOptions = false, showCreateEvent = false }) => {
        const history = useHistory();

        const goToCreateEvent = useCallback(() => {
            history.push(`/create/diseaseOutbreakEvent`);
        }, [history]);

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
                            <ListItem button key={text} component={NavLink} to={value}>
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
