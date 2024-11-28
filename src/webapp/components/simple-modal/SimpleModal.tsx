import React from "react";
import { Modal, CardContent, Card } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Button } from "../button/Button";

type SimpleModalProps = {
    title: string;
    children: React.ReactNode;
    footerButtons?: React.ReactNode;
    open: boolean;
    onClose: () => void;
    closeLabel?: string;
    alignFooterButtons?: "start" | "center" | "end";
    buttonDirection?: "row" | "column" | "row-reverse" | "column-reverse";
};

export const SimpleModal: React.FC<SimpleModalProps> = React.memo(
    ({
        alignFooterButtons,
        buttonDirection,
        children,
        footerButtons,
        closeLabel,
        open = false,
        onClose,
        title,
    }) => {
        return (
            <Modal
                aria-labelledby={`modal-${title}`}
                aria-describedby={`${title}-modal`}
                open={open}
                onClose={onClose}
                hideBackdrop
            >
                <StyledCard variant="outlined">
                    <Title>{title}</Title>

                    <Content>
                        <StyledCardContent>{children}</StyledCardContent>
                    </Content>

                    <Footer
                        alignFooterButtons={alignFooterButtons}
                        buttonDirection={buttonDirection}
                    >
                        {footerButtons ?? null}
                        <Button variant="outlined" color="secondary" onClick={onClose}>
                            {closeLabel ? closeLabel : i18n.t("Close")}
                        </Button>
                    </Footer>
                </StyledCard>
            </Modal>
        );
    }
);

const Content = styled.div`
    display: flex;
    @media (max-width: 700px) {
        flex-direction: column;
    }
`;

const Title = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 1.25rem;
    font-weight: 500;
`;

const Footer = styled.div<{ alignFooterButtons?: string; buttonDirection?: string }>`
    display: flex;
    margin-block-start: 16px;
    gap: 8px;
    justify-content: ${props => props.alignFooterButtons};
    flex-direction: ${props => props.buttonDirection};
`;

const StyledCard = styled(Card)`
    width: 500px;
    @media (max-width: 700px) {
        width: 300px;
    }
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 24px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
`;

const StyledCardContent = styled(CardContent)`
    width: 100%;
`;
