import React from "react";
import styled from "styled-components";
import { IconInfo24 } from "@dhis2/ui";

import { Separator } from "../separator/Separator";
import { IconButton } from "../icon-button/IconButton";

type FormSectionProps = {
    title: string;
    children: React.ReactNode;
    hasSeparator?: boolean;
    onClickInfo?: () => void;
    direction?: "row" | "column";
};

export const FormSection: React.FC<FormSectionProps> = React.memo(
    ({ title, hasSeparator = false, children, onClickInfo, direction = "row" }) => {
        return (
            <FormSectionContainer>
                {hasSeparator && <Separator margin="12px" />}
                <Container direction={direction}>
                    <TitleContainer>
                        <RequiredText>{title}</RequiredText>
                        {onClickInfo && <IconButton icon={<IconInfo24 />} onClick={onClickInfo} />}
                    </TitleContainer>
                    <FormContainer>{children}</FormContainer>
                </Container>
            </FormSectionContainer>
        );
    }
);

const FormSectionContainer = styled.div`
    width: 100%;
    margin-block-end: 24px;
`;

const Container = styled.div<{ direction: string }>`
    display: flex;
    flex-direction: ${props => props.direction};
    width: 100%;
    gap: ${props => (props.direction === "row" ? "48px" : "24px")};
    align-items: ${props => (props.direction === "row" ? "center" : "flex-start")};
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const FormContainer = styled.div`
    width: 100%;
`;

const RequiredText = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;
    &::after {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-start: 4px;
    }
`;
