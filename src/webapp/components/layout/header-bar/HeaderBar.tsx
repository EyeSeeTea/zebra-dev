import React from "react";
import styled from "styled-components";
import { HeaderBar as D2HeaderBar } from "@dhis2/ui";

type HeaderBarProps = {
    name: string;
};

export const HeaderBar: React.FC<HeaderBarProps> = React.memo(({ name }) => {
    return (
        <Container>
            <FlagBar color="red" />
            <FlagBar color="black" />
            <FlagBar color="orange" />
            <AppName>{name}</AppName>
            <StyledHeaderBar className="app-header" appName="ZEBRA App" />
        </Container>
    );
});

const Container = styled.div`
    display: flex;
`;

const FlagBar = styled.div<{ color: string }>`
    background-color: ${props => props.theme.palette.flag[props.color]};
    height: 48px;
    width: 16.56px;
    min-width: 16.56px;
`;

const AppName = styled.span`
    align-content: center;
    font-size: 1.875rem;
    font-weight: 700;
    background-color: ${props => props.theme.palette.header.color};
    color: ${props => props.theme.palette.common.white};
    height: 48px;
    width: 94px;
    min-width: 94px;
    padding-inline: 16px;
`;

const StyledHeaderBar = styled(D2HeaderBar)`
    &.app-header {
        background-color: ${props => props.theme.palette.header.color};
        width: 100%;
        border: none;
    }
`;
