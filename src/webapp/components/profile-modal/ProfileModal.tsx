import React from "react";
import { Modal, Avatar, CardContent, Card } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Button } from "../button/Button";

type ProfileModalProps = {
    name: string;
    children: React.ReactNode;
    footerButtons?: React.ReactNode;
    alt?: string;
    src?: string;
    open: boolean;
    onClose: () => void;
};

export const ProfileModal: React.FC<ProfileModalProps> = React.memo(
    ({ children, footerButtons, src, alt, open = false, onClose, name }) => {
        return (
            <Modal
                aria-labelledby={`modal-${name}`}
                aria-describedby={`${name}-profile`}
                open={open}
                onClose={onClose}
                hideBackdrop
            >
                <StyledCard variant="outlined">
                    <Name>{name}</Name>

                    <Content>
                        <AvatarContainer>
                            <Avatar alt={alt} src={src} />
                        </AvatarContainer>

                        <StyledCardContent>{children}</StyledCardContent>
                    </Content>

                    <Footer>
                        <Button onClick={onClose}>{i18n.t("Close")}</Button>
                        {footerButtons ?? null}
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

const Name = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 1.25rem;
    font-weight: 500;
`;

const Footer = styled.div`
    display: flex;
    margin-block-start: 16px;
    gap: 16px;
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

const AvatarContainer = styled.div`
    padding-block: 20px;
    padding-inline: 45px;
    .MuiAvatar-root {
        width: 121px;
        height: 121px;
    }
`;

const StyledCardContent = styled(CardContent)`
    width: 100%;
`;
