import React from "react";
import styled from "styled-components";
import { IconInfo24 } from "@dhis2/ui";

import { Separator } from "../separator/Separator";
import { IconButton } from "../icon-button/IconButton";

type FormSectionProps = {
    title?: string;
    required?: boolean;
    children: React.ReactNode;
    hasSeparator?: boolean;
    onClickInfo?: () => void;
    direction?: "row" | "column";
};

export const FormSection: React.FC<FormSectionProps> = React.memo(
    ({
        title,
        hasSeparator = false,
        children,
        onClickInfo,
        direction = "row",
        required = false,
    }) => {
        return (
            <FormSectionContainer>
                {hasSeparator && <Separator margin="12px" />}

                <Container direction={direction}>
                    {title && (
                        <TitleContainer direction={direction}>
                            <RequiredText className={required ? "required" : ""}>
                                {title}
                            </RequiredText>

                            {onClickInfo && (
                                <IconButton icon={<IconInfo24 />} onClick={onClickInfo} />
                            )}
                        </TitleContainer>
                    )}

                    <FormContainer fulWidth={!title}>{children}</FormContainer>
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
    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const TitleContainer = styled.div<{ direction: string }>`
    display: flex;
    align-items: center;
    gap: 4px;
    width: 30%;
`;

const FormContainer = styled.div<{ fulWidth: boolean }>`
    width: ${props => (props.fulWidth ? "100%" : "70%")};
`;

const RequiredText = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;

    &.required::after {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-start: 4px;
    }
`;
