import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { MainContent } from "./main-content/MainContent";
import { Button } from "../button/Button";

interface LayoutProps {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    hideSideBarOptions?: boolean;
}

export const Layout: React.FC<LayoutProps> = React.memo(
    ({ children, title = "", subtitle = "", hideSideBarOptions = false }) => {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

        const [sideBarOpen, setSideBarOpen] = useState(false);
        return (
            <Container>
                {isSmallScreen && !hideSideBarOptions ? (
                    <Button onClick={() => setSideBarOpen(!sideBarOpen)}>Open sidebar</Button>
                ) : null}
                <MainContent
                    sideBarOpen={sideBarOpen}
                    toggleSideBar={setSideBarOpen}
                    hideSideBarOptions={hideSideBarOptions}
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
