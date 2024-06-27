import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { Menu } from "@material-ui/icons";

import { MainContent } from "./main-content/MainContent";
import { Button } from "../button/Button";

type LayoutProps = {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    hideSideBarOptions?: boolean;
    showCreateEvent?: boolean;
};

export const Layout: React.FC<LayoutProps> = React.memo(
    ({
        children,
        title = "",
        subtitle = "",
        hideSideBarOptions = false,
        showCreateEvent = false,
    }) => {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

        const [sideBarOpen, setSideBarOpen] = useState(false);
        return (
            <Container>
                {isSmallScreen && !hideSideBarOptions ? (
                    <OpenMenuContainer>
                        <Button onClick={() => setSideBarOpen(!sideBarOpen)} startIcon={<Menu />} />
                    </OpenMenuContainer>
                ) : null}
                <MainContent
                    sideBarOpen={sideBarOpen}
                    toggleSideBar={setSideBarOpen}
                    hideSideBarOptions={hideSideBarOptions}
                    showCreateEvent={showCreateEvent}
                    title={title}
                    subtitle={subtitle}
                >
                    {children}
                </MainContent>
            </Container>
        );
    }
);

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const OpenMenuContainer = styled.div`
    width: 100%;
    background-color: ${props => props.theme.palette.background.default};
    .MuiButton-startIcon {
        margin: 0;
    }
`;
