import { List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import i18n from "../../../../utils/i18n";

interface SideBarContentProps {
    children?: React.ReactNode;
    hideOptions?: boolean;
}

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
    ({ children, hideOptions = false }) => {
        return (
            <SideBarContainer>
                {hideOptions ? null : children ? (
                    children
                ) : (
                    <List>
                        {DEFAULT_SIDEBAR_OPTIONS.map(({ text, value }) => (
                            <ListItem button key={text} component={NavLink} to={value}>
                                <StyledText primary={i18n.t(text)} selected={false} />
                            </ListItem>
                        ))}
                    </List>
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
    }
`;

const SideBarContainer = styled.div`
    display: flex;
    width: 240px;
    background-color: ${props => props.theme.palette.sidebar.background};
    .MuiList-root {
        padding-block: 50px;
    }
    .MuiListItem-root {
        margin-inline: 8px;
    }
    .MuiButtonBase-root {
        padding-inline: 24px;
        padding-block: 4px;
    }
`;
