import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Link } from "@material-ui/core";
import { IconEditItems24 } from "@dhis2/ui";

import i18n from "../../../utils/i18n";
import { TeamMember } from "../../../domain/entities/TeamMember";
import { ProfileModal } from "../profile-modal/ProfileModal";
import { useAppContext } from "../../contexts/app-context";
import { Button } from "../button/Button";

type TeamMemberProfileProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    member: TeamMember;
    diseaseOutbreakEventName: string;
};

export const TeamMemberProfile: React.FC<TeamMemberProfileProps> = React.memo(props => {
    const { open, setOpen, member, diseaseOutbreakEventName } = props;
    const { api } = useAppContext();

    const teamRolesNames = useMemo(
        () => member.teamRoles?.map(role => role.name).join(", "),
        [member.teamRoles]
    );

    const onRedirectToProfile = useCallback(() => {
        window.open(`${api.baseUrl}/dhis-web-user/index.html#/users/edit/${member.id}`, "_blank");
    }, [api.baseUrl, member.id]);

    return (
        <ProfileModal
            open={open}
            onClose={() => setOpen(false)}
            name={member.name}
            src={member.photo?.toString()}
            alt={member.photo ? `Photo of ${member.name}` : undefined}
            footerButtons={
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<IconEditItems24 />}
                    onClick={onRedirectToProfile}
                >
                    {i18n.t("Edit Profile")}
                </Button>
            }
        >
            <Container>
                <Text>{member.phone}</Text>

                <StyledLink href={`mailto:${member.email}`}>{member.email}</StyledLink>

                {teamRolesNames && <Text>{teamRolesNames}</Text>}

                <AssignContainer>
                    <TextBold>{i18n.t("Currently assigned:", { nsSeparator: false })}</TextBold>

                    <Text>{diseaseOutbreakEventName}</Text>
                </AssignContainer>
            </Container>
        </ProfileModal>
    );
});

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const AssignContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
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
