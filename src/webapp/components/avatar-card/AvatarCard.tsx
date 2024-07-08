import React from "react";
import { CardContent, Card, Avatar } from "@material-ui/core";
import styled from "styled-components";

type AvatarCardProps = {
    children: React.ReactNode;
    avatarSize?: "small" | "medium";
    alt?: string;
    src?: string;
};

export const AvatarCard: React.FC<AvatarCardProps> = React.memo(
    ({ children, src, alt, avatarSize = "small" }) => {
        return (
            <StyledCard variant="outlined">
                <AvatarContainer $size={avatarSize}>
                    <Avatar alt={alt} src={src} />
                </AvatarContainer>

                <StyledCardContent>{children}</StyledCardContent>
            </StyledCard>
        );
    }
);

const StyledCard = styled(Card)`
    width: 100%;
    display: flex;
    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const AvatarContainer = styled.div<{ $size: string }>`
    padding-block: 20px;
    padding-inline: 45px;
    .MuiAvatar-root {
        width: ${props => (props.$size === "medium" ? " 85px" : "56px")};
        height: ${props => (props.$size === "medium" ? " 85px" : "56px")};
    }
`;

const StyledCardContent = styled(CardContent)`
    width: 100%;
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
`;
