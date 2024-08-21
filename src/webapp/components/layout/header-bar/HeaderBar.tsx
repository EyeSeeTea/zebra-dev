import React from "react";
import styled from "styled-components";
import { HeaderBar as D2HeaderBar } from "@dhis2/ui";

import znphiLogo from "../../../assets/znphi-dark-logo.png";

type HeaderBarProps = {
    name: string;
};

export const HeaderBar: React.FC<HeaderBarProps> = React.memo(({ name }) => {
    return (
        <Container>
            <ButtonMenuContainer />

            <FlagBar color="red" />

            <FlagBar color="black" />

            <FlagBar color="orange" />

            <AppName>{name}</AppName>

            <IconContainer>
                <img src={znphiLogo} alt="ZNPHI logo" />
            </IconContainer>

            <StyledHeaderBar className="app-header" appName="ZEBRA App" />
        </Container>
    );
});

const Container = styled.div`
    display: flex;
`;

const IconContainer = styled.div`
    img {
        background-color: ${props => props.theme.palette.header.color};
        height: 48px;
        width: 72px;
    }
`;

const ButtonMenuContainer = styled.div`
    background-color: ${props => props.theme.palette.header.color};
    @media (max-width: 959px) {
        width: 55px;
        height: 48px;
    }
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
    padding-inline-start: 16px;
`;

const StyledHeaderBar = styled(D2HeaderBar)`
    &.app-header {
        background-color: ${props => props.theme.palette.header.color};
        width: calc(100% - 232px);
        border: none;
        @media (max-width: 959px) {
            width: calc(100% - 287px);
        }
    }
`;
