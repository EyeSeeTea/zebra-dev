import { Drawer, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import { SideBarContent } from "./SideBarContent";

type SideBarProps = {
    children?: React.ReactNode;
    hideOptions?: boolean;
    open: boolean;
    toggleSideBar: (isOpen: boolean) => void;
    showCreateEvent?: boolean;
};

export const SideBar: React.FC<SideBarProps> = React.memo(
    ({ children, hideOptions = false, toggleSideBar, open = false, showCreateEvent = false }) => {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
        return (
            <React.Fragment>
                {isSmallScreen ? (
                    <StyledDrawer open={open} onClose={() => toggleSideBar(false)}>
                        <SideBarContent hideOptions={hideOptions} showCreateEvent={showCreateEvent}>
                            {children}
                        </SideBarContent>
                    </StyledDrawer>
                ) : (
                    <SideBarContent hideOptions={hideOptions} showCreateEvent={showCreateEvent}>
                        {children}
                    </SideBarContent>
                )}
            </React.Fragment>
        );
    }
);

const StyledDrawer = styled(Drawer)`
    .MuiBackdrop-root {
        background-color: transparent;
    }

    .MuiDrawer-paper {
        height: calc(100% - 48px);
        top: 48px;
    }
`;
