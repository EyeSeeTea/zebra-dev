import React from "react";
import { IconInfo24 } from "@dhis2/ui";
import styled from "styled-components";

type NoticeBoxProps = {
    title: string;
    children: React.ReactNode;
};

export const NoticeBox: React.FC<NoticeBoxProps> = React.memo(({ title, children }) => {
    return (
        <Container>
            <TitleContainer>
                <IconInfo24 />
                {title}
            </TitleContainer>
            <Content>{children}</Content>
        </Container>
    );
});

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
    padding-block: 12px;
    gap: 8px;
    background-color: ${props => props.theme.palette.common.blue050};
    border-radius: 3px;
    border: 2px solid ${props => props.theme.palette.common.blue200};
`;

const TitleContainer = styled.div`
    display: flex;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme.palette.text.primary};
    align-items: center;
    svg {
        color: ${props => props.theme.palette.common.blue900};
    }
`;

const Content = styled.div`
    margin-inline-start: 32px;
    font-size: 0.875rem;
    font-weight: 400;
    color: ${props => props.theme.palette.text.primary};
`;
