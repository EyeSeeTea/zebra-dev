import React from "react";
import { User } from "./UserSelector";
import { AvatarCard } from "../avatar-card/AvatarCard";
import styled from "styled-components";
import { Link } from "@material-ui/core";
import i18n from "@eyeseetea/d2-ui-components/locales";

type UserCardProps = {
    selectedUser: User;
};
export const UserCard: React.FC<UserCardProps> = React.memo(props => {
    const { selectedUser } = props;

    return (
        <AvatarContainer>
            <AvatarCard avatarSize="medium" alt={selectedUser?.alt} src={selectedUser?.src}>
                <Container>
                    <Content>
                        <TextBold>{selectedUser?.label}</TextBold>

                        {selectedUser?.workPosition && <Text>{selectedUser?.workPosition}</Text>}

                        {selectedUser?.teamRoles && <Text>{selectedUser?.teamRoles}</Text>}
                        {selectedUser?.phone && <Text>{selectedUser?.phone}</Text>}
                        {selectedUser?.email && (
                            <StyledLink href={`mailto:${selectedUser?.email}`}>
                                {selectedUser?.email}
                            </StyledLink>
                        )}
                    </Content>

                    {selectedUser?.status && (
                        <div>
                            <TextBold>{i18n.t("Status: ", { nsSeparator: false })}</TextBold>

                            {selectedUser?.status && <Text>{selectedUser?.status}</Text>}
                        </div>
                    )}
                </Container>
            </AvatarCard>
        </AvatarContainer>
    );
});
const AvatarContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 2;
    max-width: 400px;
    flex-basis: 0;
    @media (max-width: 800px) {
        align-self: center;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TextBold = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 700;
`;

const Text = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 400;
`;

const StyledLink = styled(Link)`
    &.MuiTypography-colorPrimary {
        font-size: 0.875rem;
        font-weight: 400;
        text-decoration: underline;
        color: ${props => props.theme.palette.common.black};
    }
`;
