import React from "react";
import styled from "styled-components";

import { SideBar } from "../side-bar/SideBar";

type MainContentProps = {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    hideSideBarOptions?: boolean;
    sideBarOpen: boolean;
    toggleSideBar: (isOpen: boolean) => void;
    showCreateEvent?: boolean;
};

export const MainContent: React.FC<MainContentProps> = React.memo(
    ({
        children,
        title = "",
        subtitle = "",
        hideSideBarOptions = false,
        showCreateEvent = false,
        toggleSideBar,
        sideBarOpen,
    }) => {
        return (
            <Container>
                <SideBar
                    hideOptions={hideSideBarOptions}
                    open={sideBarOpen}
                    toggleSideBar={toggleSideBar}
                    showCreateEvent={showCreateEvent}
                />
                <Main>
                    {title && <Title>{title}</Title>}
                    {subtitle && <SubTitle>{subtitle}</SubTitle>}
                    <PageContent>{children}</PageContent>
                </Main>
            </Container>
        );
    }
);

const Container = styled.div`
    display: flex;
`;

const Title = styled.span`
    font-size: 1.75rem;
    font-weight: 400;
    color: ${props => props.theme.palette.text.primary};
`;

const SubTitle = styled.span`
    margin-block-start: 8px;
    font-size: 1rem;
    font-weight: 400;
    color: ${props => props.theme.palette.text.secondary};
`;

const PageContent = styled.div`
    margin-block-start: 48px;
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background: ${props => props.theme.palette.background.default};
    padding-inline: 40px;
    padding-block-start: 55px;
    padding-block-end: 60px;
`;
