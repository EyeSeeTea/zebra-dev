import React from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Button } from "../button/Button";
import { Separator } from "../separator/Separator";

type FormLayoutProps = {
    title?: string;
    subtitle?: string;
    saveLabel?: string;
    cancelLabel?: string;
    children: React.ReactNode;
    onSave: () => void;
    onCancel?: () => void;
};

export const FormLayout: React.FC<FormLayoutProps> = React.memo(
    ({ title, subtitle, saveLabel, cancelLabel, children, onSave, onCancel }) => {
        return (
            <StyledFormLayout>
                <Header>
                    <TitleContainer>
                        {title && <Title>{title}</Title>}
                        {subtitle && <Subtitle>{subtitle}</Subtitle>}
                    </TitleContainer>

                    <RequiredText>{i18n.t("Indicates required")}</RequiredText>
                </Header>

                <Content>{children}</Content>

                <Footer>
                    <Separator margin="12px" />

                    <ButtonsFooter>
                        <Button onClick={onSave}>{saveLabel || i18n.t("Save")}</Button>
                        {onCancel && (
                            <Button onClick={onCancel} variant="outlined" color="secondary">
                                {cancelLabel || i18n.t("Cancel")}
                            </Button>
                        )}
                    </ButtonsFooter>
                </Footer>
            </StyledFormLayout>
        );
    }
);

const StyledFormLayout = styled.div`
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Content = styled.div`
    width: 100%;
`;

const Footer = styled.div``;

const ButtonsFooter = styled.div`
    margin-block-start: 48px;
    display: flex;
    gap: 48px;
`;

const TitleContainer = styled.div`
    display: flex;
    gap: 4px;
`;

const Title = styled.span`
    color: ${props => props.theme.palette.common.grey700};
    font-size: 0.875rem;
    font-weight: 700;
`;

const Subtitle = styled.span`
    color: ${props => props.theme.palette.common.grey700};
    font-size: 0.875rem;
    font-weight: 400;
`;

const RequiredText = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 700;
    &::before {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-end: 4px;
    }
`;
