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
    position: absolute;
    top: 0px;

    .MuiButton-root {
        background-color: ${props => props.theme.palette.header.color};
        height: 48px;
        width: 55px;
        border-radius: 0;
        min-width: 55px;
    }

    .MuiSvgIcon-root {
        font-size: 25px;
    }

    .MuiButton-startIcon {
        margin: 0;
        background-color: ${props => props.theme.palette.header.color};
    }
`;
